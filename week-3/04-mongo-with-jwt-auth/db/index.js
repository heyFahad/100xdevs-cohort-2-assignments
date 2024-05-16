const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

// Define schemas
const AdminSchema = new mongoose.Schema(
    {
        // Schema definition here
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const UserSchema = new mongoose.Schema(
    {
        // Schema definition here
        username: {
            type: String,
            require: true,
            unique: true,
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
    },
    {
        timestamps: true,
    }
);

const CourseSchema = new mongoose.Schema(
    {
        // Schema definition here
        title: {
            type: String,
            required: true,
            unique: true,
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
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
        published: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Generate the database models based on the schema definitions defined above
 */
const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course,
};
