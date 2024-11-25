const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    let newObj = {};

    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};
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

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        next(new AppError('This route is not used for updating password', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: 'success',
        message: 'data updated successfully',
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (
        !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
        return next(new AppError('current password is incorrect', 401));
    }

    user.active = false;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
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
