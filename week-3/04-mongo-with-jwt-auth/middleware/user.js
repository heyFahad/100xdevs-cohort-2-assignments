const { promisify } = require('node:util');
const { z } = require('zod');
const { verify } = require('jsonwebtoken');
const { User } = require('../db');

const verifyAsync = promisify(verify);

// define the Zod schema for parsing and validating the incoming request's auth header
const authHeaderSchema = z.string().startsWith('Bearer ', "Authorization header improperly formatted. Expected format: 'Authorization: Bearer <token>'");

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).json({ message: 'Authorization header is missing from the request' });
    }

    // if the header is present, make sure that it is properly formatted before proceeding
    const parsedAuthorization = authHeaderSchema.safeParse(authorization);
    if (!parsedAuthorization.success) {
        return res.status(400).json({ message: "Authorization header improperly formatted. Expected format: 'Authorization: Bearer <token>'" });
    }

    // since the header is properly formatted, we now need to extract the JWT token from it
    const authHeader = parsedAuthorization.data;
    const accessToken = authHeader.split(' ')[1];

    // now let's verify this token and see if it contains a valid user data or not
    try {
        // first, decode and verify if this is still a valid token or not
        const decodedToken = await verifyAsync(accessToken, process.env.JWT_SECRET);

        // if the token is valid, we then need to make sure that this token belongs a `User` and not to any other actor in our system
        const isUserRequest = await User.findById(decodedToken.id);
        if (!isUserRequest) {
            return res.status(403).json({ message: 'Only non-admin users can access this endpoint' });
        }

        // after validating the correct user permissions associated with the token, we'll let the request move on to the next middleware/controller now
        req.user = isUserRequest; // attach the actual user object fetched from the database to this incoming request instead of just attaching the decodedToken
        next();
    } catch (error) {
        // return the 401 Unauthorized error response to the user if the token validation fails at any stage
        error.status = 401;
        error.message = 'Invalid access token';
        next(error);
    }
}

module.exports = userMiddleware;
