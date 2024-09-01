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
        const queryObj = { ...req.query };
        const excludedField = ['page', 'sort', 'limit', 'field'];
        excludedField.forEach((el) => delete queryObj[el]);

        const queryStr = JSON.stringify(queryObj);
        const modifiedQuery = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
        );

        const query = Tour.find(JSON.parse(modifiedQuery));

        const tours = await query;

        res.status(200).json({
            status: 'success',
            data: {
                tours,
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
