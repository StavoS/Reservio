const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

router.route('/top-5-cheap').get(tourController.aliasTopToursByPrice, tourController.getAllTours);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.addNewTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
