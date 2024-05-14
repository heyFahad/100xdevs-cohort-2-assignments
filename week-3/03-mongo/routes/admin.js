const { z } = require('zod');
const { Router } = require('express');
const adminMiddleware = require('../middleware/admin');
const { Admin, Course } = require('../db');

const router = Router();

const signupBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});

const createCourseBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    price: z.number(),
    imageLink: z.string().url(),
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

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const parsedBody = createCourseBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error);
    }

    // body data is correct. Save this new course into the database
    const { title, description, price, imageLink } = parsedBody.data;
    const course = await Course.create({
        title,
        description,
        price,
        imageLink,
    });

    // course created successfully. Return the response now
    return res.status(200).json({ message: 'Course created successfully', courseId: course.id });
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Admin.find();
    return res.status(200).json({ courses });
});

module.exports = router;
