const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('../controllers/authController');
const router = express.Router();

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopToursByPrice, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:id').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.addNewTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
