const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'a tour must have a name'],
        unique: true,
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