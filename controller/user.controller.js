const db = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
require('dotenv').config();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const createUser = catchAsync(async (req, res, next) => {
    try {

        const { email, password, role, confirmPassword } = req.body;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

        if (!password.match(passwordRegex)) {
            throw new AppError(400, 'Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, and one number.');
        }

        if (password !== confirmPassword) {
            throw new AppError(400, 'Passwords do not match');
        }

        if (role !== 'agency' && role !== 'admin') {
            throw new AppError(400, 'Invalid role');
        }


        // Check if the user already exists in the database
        const existingUser = await db.User.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new AppError(409, 'User already exists');
        }

        const data = {
            email,
            confirmPassword,
            role,
            password: await bcrypt.hash(password, 10),
        };

        // Save the user info
        const user = await db.User.create(data);

        if (user) {
            return res.status(201).send({
                statusCode: 201,
                status: 'success',
                message: 'Signup successful',
            });
        }
    } catch (error) {
        next(error);
    }
});

const loginUser = catchAsync(async (req, res, next) => {
    try {
        const expiresInTwoMonths = 2 * 30 * 24 * 60 * 60 * 1000;
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            throw new AppError(400, 'Please provide email and password');
        }

        // Find user by email
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            throw new AppError(401, 'Incorrect email or password');
        }

        // Check if account is active
        if (!user.active) {
            throw new AppError(403, 'Account is not active');
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError(401, 'Incorrect email or password');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.userId, email: user.email, role: user.role },
            process.env.SECRETE_KEY || "SECRETE_KEY",
            { expiresIn: expiresInTwoMonths }
        );

        // Send response with token and user details
        res.status(200).json({
            status: 'success',
            token,
        });
    } catch (error) {
        next(error);
    }
});


const updateProfileForAgencies = catchAsync(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { fullName, email, address, phoneNumber, password, website, type } = req.body;

        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Update user details only if provided in the request body
        if (fullName?.trim()) user.fullName = fullName;
        if (email?.trim()) user.email = email;
        if (address?.trim()) user.address = address;
        if (phoneNumber?.trim()) user.phoneNumber = phoneNumber;
        if (type?.trim()) user.type = type;
        if (website?.trim()) user.website = website;

        // Hash the password if it's being updated and meets the complexity requirements
        if (password?.trim()) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
            if (!password.match(passwordRegex)) {
                throw new AppError(400, 'Password must meet complexity requirements.');
            }
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
});

const updateProfileForAdmin = catchAsync(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { fullName, email, address, phoneNumber, website, type } = req.body;

        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Update user details only if provided in the request body
        if (fullName?.trim()) user.fullName = fullName;
        if (email?.trim()) user.email = email;
        if (address?.trim()) user.address = address;
        if (phoneNumber?.trim()) user.phoneNumber = phoneNumber;
        if (type?.trim()) user.type = type;
        if (website?.trim()) user.website = website;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
});


const getUserProfile = catchAsync(async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(401, 'No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.SECRETE_KEY || "SECRETE_KEY");
        const { id, role } = decoded;

        // Find the user associated with the token
        const user = await db.User.findOne({
            where: { userId: id },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }, // Exclude sensitive fields
        });

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Initialize response object with user data
        let response = { status: 'success', data:user };

        // Get user dataValues for direct modification
        const userDataValues = user.dataValues;

        // Additional data for agency role
        if (role === 'agency') {
            // Get number of projects assigned to this user and number of completed projects
            const totalProjects = await db.Project.count({ where: { agency: id } });
            const completedProjects = await db.Project.count({ where: { agency: id, completed: true } });

            // Attach these directly to the dataValues object
            userDataValues.totalProjects = totalProjects;
            userDataValues.completedProjects = completedProjects;
        }

        // Additional data for admin role
        if (role === 'admin') {
            // Count the total number of projects and completed projects
            const totalProjects = await db.Project.count();
            const completedProjects = await db.Project.count({ where: { completed: true } });

            // Count the total number of users with role 'agency' and active agencies
            const totalAgencyUsers = await db.User.count({ where: { role: 'agency' } });
            const activeAgencyUsers = await db.User.count({ where: { role: 'agency', active: true } });

            // Attach these directly to the dataValues object
            userDataValues.totalProjects = totalProjects;
            userDataValues.completedProjects = completedProjects;
            userDataValues.totalAgencyUsers = totalAgencyUsers;
            userDataValues.activeAgencyUsers = activeAgencyUsers;
        }

        // Send the full response
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    getUserProfile,
};




module.exports = {
    createUser,
    loginUser,
    updateProfileForAgencies,
    updateProfileForAdmin,
    getUserProfile
}