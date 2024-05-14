const { z } = require('zod');

const { User } = require('../db');

const authHeadersSchema = z.object({
    username: z.string(),
    password: z.string(),
});

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const parsedHeaders = authHeadersSchema.safeParse(req.headers);
    if (!parsedHeaders.success) {
        const missingHeadersError = new Error("Both the 'username' and 'password' must be provided in headers to authenticate the request");
        missingHeadersError.status = 401; // 401 Unauthorized
        return next(missingHeadersError);
    }

    // auth headers are complete. Proceed with the user auth validation
    const { username, password } = parsedHeaders.data;
    const user = await User.findOne({ username, password });

    if (user) {
        // the given credentials belong to a real user. Let the request proceed.
        req.user = user;
        next();
    } else {
        // no user exists with the given credentials. Request is from a scammer
        const userNotFoundError = new Error('Invalid user credentials provided. Please try again.');
        userNotFoundError.status = 401;
        next(userNotFoundError);
    }
}

module.exports = userMiddleware;
