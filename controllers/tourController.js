const fs = require('fs');
const { Tour } = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res
            .status(400)
            .json({ status: 'fail', message: 'invalid request' });
    }
    next();
};

exports.aliasTopToursByPrice = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'ratingsAverage,summary,difficulty,price,';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .fields()
            .pagination();

        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            data: {
                tours,
            },
        });
    } catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).json({
            status: 'error',
            message: err,
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
        const newTour = await Tour.create(req.body);
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
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

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

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            message: 'tour deleted!',
        });
    } catch (err) {
        console.log(`Error${err}`);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: -1 },
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats,
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

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01T00:00:00Z`),
                    },
                },
            },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan,
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
