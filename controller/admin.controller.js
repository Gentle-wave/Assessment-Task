const db = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllAgencies = catchAsync(async (req, res, next) => {
    try {
        const agencies = await db.User.findAll({
            where: { role: 'agency' },
            attributes: ['userId', 'fullName', 'email', 'type', 'phoneNumber', 'address', 'active'], // Include the fields you want
        });

        res.status(200).json({
            status: 'success',
            data: { agencies },
        });
    } catch (error) {
        next(error);
    }
});

const toggleUserActiveStatus = catchAsync(async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Find the user by their ID
        const user = await db.User.findByPk(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        // Toggle the user's active status
        user.active = !user.active;

        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User status updated successfully. User is now ${user.active ? 'active' : 'inactive'}.`,
            data: { userId: user.userId, active: user.active },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = {
    getAllAgencies,
    toggleUserActiveStatus
}