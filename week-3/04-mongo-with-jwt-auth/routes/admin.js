const { promisify } = require('util');
const { z } = require('zod');
const { compare, hash } = require('bcrypt'); // note that this package is `bcrypt` and not the `bcryptjs`
const { sign } = require('jsonwebtoken');
const { Router } = require('express');

const signAsync = promisify(sign);

const adminMiddleware = require('../middleware/admin');
const { Admin, Course } = require('../db');

const adminAuthBodySchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

const createCourseBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    price: z.number(),
    imageLink: z.string().url(),
});

const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const parsedBody = adminAuthBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error);
    }

    // request body is correct. Proceed with the rest of the validations
    const { username, password: rawPassword } = parsedBody.data;

    // check if an admin already exists with the given username or not
    const adminAlreadyExists = await Admin.findOne({ username });
    if (adminAlreadyExists) {
        return res.status(409).json({ message: 'An admin already exists with this username. Please try with a different username.' });
    }

    // no admin exists with the given username. Proceed with hashing the password to store in database
    const saltRounds = 10; // Define the number of salting rounds. A useful note on selecting a appropriate round can be found at https://www.npmjs.com/package/bcrypt#a-note-on-rounds
    const hashedPassword = await hash(rawPassword, saltRounds);

    // now since we have all the data ready (username and the hashed password), it's time to save the admin account in database
    await Admin.create({
        username,
        password: hashedPassword,
    });

    // finally, return the success response to the user
    return res.status(201).json({ message: 'Admin created successfully' });
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const parsedBody = adminAuthBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error); // 400 Bad Request
    }

    // request body seems to be correct. Let's see if the admin really exists or not
    const { username, password } = parsedBody.data;
    const adminExists = await Admin.findOne({ username });
    if (!adminExists) {
        return res.status(404).json({ message: 'Admin does not exist' }); // 404 Not Found
    }

    // if the admin exists, we then need to compare the given password with the stored hash
    const isPasswordMatched = await compare(password, adminExists.password);
    if (!isPasswordMatched) {
        return res.status(403).json({ message: 'Username or password is not correct' }); // 403 Forbidden. Unlike 401 Unauthorized, the client's identity is known to the server.
    }

    // since the user credentials are correct, now we need to generate a JWT token for this user so that they can use it for their future requests
    const token = await signAsync({ id: adminExists.id }, process.env.JWT_SECRET);

    // finally, return a success response to the user
    return res.status(200).json({ token });
});

router.post('/courses', adminMiddleware, async (req, res, next) => {
    // Implement course creation logic
    // Implement course creation logic
    const parsedBody = createCourseBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json(parsedBody.error);
    }

    // body data is correct. Save this new course into the database
    const { title, description, price, imageLink } = parsedBody.data;

    try {
        const course = await Course.create({
            title,
            description,
            price,
            imageLink,
            createdBy: req.user._id,
        });

        // course created successfully. Return the response now
        return res.status(201).json({ message: 'Course created successfully', courseId: course.id });
    } catch (error) {
        next(error);
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Admin.find();
    return res.status(200).json({ courses });
});

module.exports = router;
