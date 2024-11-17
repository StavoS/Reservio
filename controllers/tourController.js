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

exports.aliasTopToursByPrice = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'ratingsAverage,summary,difficulty,price,';
    next();
};

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedField = ['page', 'sort', 'limit', 'fields'];
        excludedField.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
        );

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        console.log(this.queryString.sort);
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    pagination() {
        const page = this.query.page * 1 || 1;
        const limit = +this.query.limit || 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);

        return this;
    }
}

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
