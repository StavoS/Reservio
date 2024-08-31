const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a tour must have a name'],
        unique: true,
    },
    durations: {
        type: Number,
        required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'a tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'a tour must have a difficulty'],
    },
    rating: {
        type: Number,
        default: 3.5,
    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price'],
    },
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

module.exports = {
    Tour,
};
