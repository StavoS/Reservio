const { Review } = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// eslint-disable-next-line no-unused-vars
exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        data: {
            reviews,
        },
    });
});

// eslint-disable-next-line no-unused-vars
exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(200).json({
        status: 'success',
        message: 'review created successfully',
        data: {
            review: newReview,
        },
    });
});
