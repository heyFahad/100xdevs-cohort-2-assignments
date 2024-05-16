const { z } = require('zod');
const { hash } = require('bcrypt'); // note that this package is `bcrypt` and not the `bcryptjs`
const { Router } = require('express');

const adminMiddleware = require('../middleware/admin');
const { Admin } = require('../db');

const adminSignUpBodySchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const parsedBody = adminSignUpBodySchema.safeParse(req.body);
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

router.post('/signin', (req, res) => {
    // Implement admin signup logic
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;
