const { promisify } = require('node:util');
const { z } = require('zod');
const { verify } = require('jsonwebtoken');
const { Admin } = require('../db');

const verifyAsync = promisify(verify);

const authHeaderSchema = z.string().refine((value) => value.startsWith('Bearer '));
// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'Authorization header is required to proceed on this API' });
    }

    // First thing first. Check if the authorization header is in correct format or not
    const parsedAuthorization = authHeaderSchema.safeParse(authorization);
    if (!parsedAuthorization.success) {
        return res.status(400).json({ message: "Authorization header improperly formatted. Expected format: 'Authorization: Bearer <token>'" });
    }

    // Authorization header is in correct format. Extract the access token from it
    const authHeader = parsedAuthorization.data;
    const token = authHeader.split(' ')[1]; // split the auth header to extract the JWT token from it

    // verify this access token to see if it is a valid token or not
    try {
        const decodedToken = await verifyAsync(token, process.env.JWT_SECRET);

        // one extra to finalize this authentication is to verify if the incoming request is actually from an admin or not
        // to do that, we'll query our database to check if an admin exists with the given ID or not
        const isAdminRequest = await Admin.findOne({ _id: decodedToken._id });
        if (!isAdminRequest) {
            return res.status(403).json({ message: 'Non-admin users are not allowed to access this endpoint' });
        }

        // else, token has been successfully decoded and verified. Add this admin's identity to the incoming request object and proceed
        req.user = decodedToken;
        next();
    } catch (error) {
        // log the error to some logging service
        console.error({ error });

        // return the error response
        error.status = 401;
        error.message = 'Invalid access token provided';
        return next(error); // this error will be caught in the global catches middleware
    }
}

module.exports = adminMiddleware;
