const fs = require('fs');
const { Tour } = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res
            .status(400)
            .json({ status: 'fail', message: 'invalid request' });
    }
    next();
};
exports.getAllTours = async (req, res) => {
    try {
        const allTours = await Tour.find({});
        res.status(200).json({
            status: 'success',
            data: {
                tours: allTours,
            },
        });
    } catch (err) {
        console.log(`Error${err}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

exports.addNewTour = async (req, res) => {
    try {
        const { name, price, rating } = req.body;
        const newTour = await Tour.create({ name, price, rating });
        res.status(201).json({
            status: 'success',
            message: 'new tour created!',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        console.log(`Error${err}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const { name, price, rating } = req.body;
        const tourId = req.params.id;

        const tour = await Tour.findById(tourId);

        if (name) {
            tour.name = name;
        }
        if (price) {
            tour.price = price;
        }
        if (rating) {
            tour.rating = rating;
        }
        tour.save();
        res.status(201).json({
            status: 'success',
            message: 'tour updated!',
            data: {
                tour,
            },
        });
    } catch (err) {
        console.log(`Error${err}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

exports.deleteTour = (req, res) => {
    console.log('deketletd');
    res.status(204).json({ status: 'success', data: null });
};
