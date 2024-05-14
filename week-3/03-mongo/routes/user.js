const { z } = require('zod');
const { Router } = require('express');
const router = Router();
const { Course, User } = require('../db');

const userMiddleware = require('../middleware/user');

const userSignUpBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const parsedBody = userSignUpBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error);
    }

    // request body is correct. Proceed with the rest of the validations
    const { username, password } = parsedBody.data;

    // Now we need to check if a user already exists with the given username or not
    const userAlreadyExists = await User.findOne({ username });
    if (userAlreadyExists) {
        // an user with the given username already exists on the server
        // return a "409 Conflict" response to let the user know
        return res.status(409).json({ message: 'A user with the same username already exists. Please try again with a different username.' });
    }

    // user does not exist. Create the new user in the database
    await User.create({ username, password });

    // user account created. Send the success response
    return res.status(200).json({ message: 'User created successfully' });
});

router.get('/courses', userMiddleware, async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find();
    return res.status(200).json({ courses });
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router;
