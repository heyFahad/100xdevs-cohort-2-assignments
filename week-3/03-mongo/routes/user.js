const { z } = require('zod');
const { Router } = require('express');
const router = Router();
const { Course, User } = require('../db');

// A helper function to test if the given string is a valid MongoDB ObjectId or not
const isMongoObjectId = (str) => {
    const regex = /^[0-9a-fA-F]{24}$/;
    return regex.test(str);
};

const userMiddleware = require('../middleware/user');

const userSignUpBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});

const purchaseCourseParamsSchema = z.object({
    courseId: z.string().refine(isMongoObjectId, {
        message: 'courseId is not a valid identifier string',
    }),
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

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const parsedParams = purchaseCourseParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
        return res.status(400).json({ message: 'courseId is not a valid identifier string' });
    }

    // the requested courseId seems to be in correct format. Let's try to see if we really have a course with the given course ID or not
    const { courseId } = parsedParams.data;
    const courseWithIdExists = await Course.findById(courseId);
    if (!courseWithIdExists) {
        return res.status(400).json({ message: 'No course exists with the given course ID' });
    }

    // Also, make sure that the user has not already purchased this course before making another purchase
    const user = await User.findById(req.user.id);
    const courseAlreadyPurchased = user.purchasedCourses.includes(courseId);
    if (courseAlreadyPurchased) {
        return res.status(409).json({ message: 'User has already purchased this course' });
    }

    // finally, if the course really exists and the user has not already purchased this course, then proceed
    user.purchasedCourses.push(courseId);
    const result = await user.save();

    // return the success response
    return res.status(200).json({ message: 'Course purchased successfully', data: result });
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const purchasedCourses = await Course.find({
        _id: {
            $in: req.user.purchasedCourses,
        },
    });

    return res.status(200).json({ purchasedCourses });
});

module.exports = router;
