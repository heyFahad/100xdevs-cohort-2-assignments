const { promisify } = require('node:util');
const { z } = require('zod');
const { compare, hash } = require('bcrypt');
const { Router } = require('express');
const { sign } = require('jsonwebtoken');
const { Course, User } = require('../db');
const userMiddleware = require('../middleware/user');

// promisify the jwt.sign function to use it with async/await rather then using it with the callback style
const signAsync = promisify(sign);

// define the Zod schemas to parse the incoming requests' body
const userAuthBodySchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

const purchaseCourseParamsSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'courseId is not a valid course identifier'),
});

// create the Router object and define routes for this module
const router = Router();

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const parsedBody = userAuthBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error);
    }

    // request payload is correct. Proceed with the next validations.
    const { username, password: rawPassword } = parsedBody.data;

    // Check if a user already exists with the given username or not
    const userAlreadyExists = await User.findOne({ username });
    if (userAlreadyExists) {
        return res.status(409).json({ message: 'A user already exist with this username' });
    }

    // If no user exists with this username, we then need to hash the incoming user's password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await hash(rawPassword, saltRounds);

    // now the data is prepared. Let's save this user into the database
    await User.create({
        username,
        password: hashedPassword,
    });

    // finally send the success response to the user
    return res.status(201).json({ message: 'User created successfully' });
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const parsedBody = userAuthBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error);
    }

    // request body is correct. Proceed with the next validations
    const { username, password } = parsedBody.data;

    // check if any user exists with the given username or not
    const userExists = await User.findOne({ username });
    if (!userExists) {
        return res.status(404).json({ message: 'User does not exist. Please signup for a new account' });
    }

    // if the user exists, we need to check if the incoming request has correct user credentials or not
    const isPasswordMatched = await compare(password, userExists.password);
    if (!isPasswordMatched) {
        return res.status(403).json({ message: 'Username or password is incorrect' });
    }

    // user authentication is done now. User is valid and their credentials are also correct
    // We now need to create a JWT access token for this user so that they can authenticate their future requests
    const token = await signAsync({ id: userExists.id }, process.env.JWT_SECRET);

    // return this token to the user for future requests
    return res.status(200).json({ token });
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
        return res.status(400).json({ message: '"courseId" is not a valid course identifier' });
    }

    // courseId param is in correct format. Let's proceed with the next validations
    const { courseId } = parsedParams.data;

    // check if there's any course with the given courseId in our database or not
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
        return res.status(404).json({ message: 'No course exists in our system with the given course identifier.' });
    }

    // if the course exists in system, we then need to verify that the user has not already purchased this course
    const { user } = req;
    const { purchasedCourses } = user;
    if (purchasedCourses.includes(courseId)) {
        return res.status(409).json({ message: 'User has already purchased this course.' });
    }

    // if all the checks are passed, let's now push this new course into the user's purchasedCourses list
    user.purchasedCourses.push(courseId);
    const result = await user.save();

    // User has been updated with the new course. Return the success response
    res.status(201).json({ message: 'Course purchased successfully', data: result });
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const purchasedCourses = await Course.find({
        _id: {
            $in: req.user.purchasedCourses,
        },
    });

    return res.status(200).json(purchasedCourses);
});

module.exports = router;
