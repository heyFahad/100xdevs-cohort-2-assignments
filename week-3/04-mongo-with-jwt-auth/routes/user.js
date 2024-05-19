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

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router;
