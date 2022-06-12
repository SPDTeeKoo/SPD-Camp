const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');



router.post('/', isLoggedIn, validateReview, reviews.createReview )

router.delete('/:reviewId', isReviewAuthor, isLoggedIn, reviews.deleteReview)

module.exports = router;