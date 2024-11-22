const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const User = require('../models/userModel');

// eslint-disable-next-line no-unused-vars
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            users,
        },
    });
});
exports.addNewUser = (req, res) => {
    res.status(500).json({ status: 'fail', message: 'Route is yet to exist' });
};
exports.getUser = (req, res) => {
    res.status(500).json({ status: 'fail', message: 'Route is yet to exist' });
};
exports.updateUser = (req, res) => {
    res.status(500).json({ status: 'fail', message: 'Route is yet to exist' });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({ status: 'fail', message: 'Route is yet to exist' });
};
