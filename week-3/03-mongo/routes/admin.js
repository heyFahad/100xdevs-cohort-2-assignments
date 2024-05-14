const { z } = require('zod');
const { Router } = require('express');
const adminMiddleware = require('../middleware/admin');
const { Admin } = require('../db');

const router = Router();

const signupBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const parsedBody = signupBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error);
    }

    // request body is correct. Proceed with rest of the validation
    const { username, password } = parsedBody.data;

    // check if a user already exists with the given username or not
    const adminAlreadyExists = await Admin.findOne({ username });
    if (adminAlreadyExists) {
        // an admin with the given username already exists on the server
        // return a "409 Conflict" response to let the user know
        return res.status(409).json({ message: 'An admin with the given username already exists' });
    }

    // admin with same username does not exist. Create the admin account
    await Admin.create({ username, password });

    // admin is created. Return the success response
    return res.status(200).json({ message: 'Admin created successfully' });
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;
