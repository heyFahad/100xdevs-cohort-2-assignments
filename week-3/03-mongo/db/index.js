const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    purchasedCourses: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Course',
        },
    ],
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    imageLink: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        required: true,
        default: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
});

/**
 * Schema validations
 */
CourseSchema.pre('save', async function (next) {
    const adminExists = await Admin.findById(this.createdBy);

    if (adminExists) {
        next();
    } else {
        next(new Error('Invalid admin reference passed to createdBy'));
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course,
};
