const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'name cant surpass 40 characters.'],
        minLength: [6, 'name must be 6 characters and above'],
    },
    rating: {
        type: Number,
        default: 3.5,
    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price'],
    },
    duration: {
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
    ratingsAverage: {
        type: Number,
        default: 0,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'a tour must have a summary'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'a tour must have an image'],
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
        },
    ],
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

//DOCUMENT MIDDLEWARE: runs before .save() and .create() NOT update

module.exports = {
    Tour,
};
