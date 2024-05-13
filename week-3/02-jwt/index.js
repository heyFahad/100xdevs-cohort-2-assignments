const jwt = require('jsonwebtoken');
const { z } = require('zod');

const usernameSchema = z.string().email();
const passwordSchema = z.string().min(6, 'Password should be at least 6 characters long');

const jwtPassword = 'secret';

/**
 * Generates a JWT for a given username and password.
 *
 * @param {string} username - The username to be included in the JWT payload.
 *                            Must be a valid email address.
 * @param {string} password - The password to be included in the JWT payload.
 *                            Should meet the defined length requirement (e.g., 6 characters).
 * @returns {string|null} A JWT string if the username and password are valid.
 *                        Returns null if the username is not a valid email or
 *                        the password does not meet the length requirement.
 */
function signJwt(username, password) {
    // Your code here
    const parsedUsername = usernameSchema.safeParse(username);
    const parsedPassword = passwordSchema.safeParse(password);

    if (!parsedUsername.success || !parsedPassword.success) {
        return null;
    }

    /**
     * Use this callback approach whenever this signing can be done asynchronously
     */
    // jwt.sign({ username: parsedUsername.data, password: parsedPassword.data }, jwtPassword, { expiresIn: '1m' }, (err, token) => {
    //     if (err) {
    //         console.error({ err });
    //         return;
    //     }

    //     // return the JWT token
    //     return token;
    // })

    return jwt.sign({ username: parsedUsername.data, password: parsedPassword.data }, jwtPassword);
}

/**
 * Verifies a JWT using a secret key.
 *
 * @param {string} token - The JWT string to verify.
 * @returns {boolean} Returns true if the token is valid and verified using the secret key.
 *                    Returns false if the token is invalid, expired, or not verified
 *                    using the secret key.
 */
function verifyJwt(token) {
    // Your code here
    try {
        // this verify call will throw an error if the passes token is not authentic
        jwt.verify(token, jwtPassword);

        /**
         * Use this callback approach whenever this verifying process can be done asynchronously
         */
        // jwt.verify(token, jwtPassword, {}, (err, jwtPayload) => {
        //     if (err) {
        //         console.error({ err });
        //         return;
        //     }

        //     // return the JWT payload
        //     return jwtPayload;
        // });
        return true;
    } catch (err) {
        console.error({ VerifyError: err });
        return false;
    }
}

/**
 * Decodes a JWT to reveal its payload without verifying its authenticity.
 *
 * @param {string} token - The JWT string to decode.
 * @returns {object|false} The decoded payload of the JWT if the token is a valid JWT format.
 *                         Returns false if the token is not a valid JWT format.
 */
function decodeJwt(token) {
    // Your code here
    const decoded = jwt.decode(token);

    if (decoded !== null) {
        return true;
    }

    return false;
}

module.exports = {
    signJwt,
    verifyJwt,
    decodeJwt,
    jwtPassword,
};
