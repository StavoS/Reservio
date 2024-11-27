const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review cannot be empty'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.'],
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must have an author.'],
    },
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

//DOCUMENT MIDDLEWARE: runs before .save() and .create() NOT update

module.exports = {
    Review,
};
