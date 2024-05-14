const { z } = require('zod');

const { Admin } = require('../db');

const authHeadersSchema = z.object({
    username: z.string(),
    password: z.string(),
});

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const parsedHeaders = authHeadersSchema.safeParse(req.headers);
    if (!parsedHeaders.success) {
        const missingHeadersError = new Error("'username' and 'password' must be provided in headers to authenticate the request");
        missingHeadersError.status = 401; // 401 Unauthorized
        return next(missingHeadersError);
    }

    // headers are present in the request. Verify the user trying to authenticate
    const { username, password } = parsedHeaders.data;
    const admin = await Admin.findOne({ username, password });

    if (admin) {
        // the given credentials belong to a real admin. Let the request proceed.
        req.user = admin;
        next();
    } else {
        // no admin exists with the given credentials. Request is from a scammer
        const adminNotFoundError = new Error('Invalid user credentials provided. Please try again.');
        adminNotFoundError.status = 401;
        next(adminNotFoundError);
    }
}

module.exports = adminMiddleware;
