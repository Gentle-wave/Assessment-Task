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
            process.env.SECRETE_KEY,
            { expiresIn: expiresInTwoMonths }
        );

        // Send response with token and user details
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    userId: user.userId,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});


const updateProfileForAgencies = catchAsync(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { fullName, email, address, phoneNumber, password, type } = req.body;

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
        const { fullName, email, address, phoneNumber, type } = req.body;

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





module.exports = {
    createUser,
    loginUser,
    updateProfileForAgencies,
    updateProfileForAdmin
}