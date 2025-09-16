const express = require("express");
const router = express.Router({ mergeParams: true });


const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewControllers = require("../controllers/reviews.js");

// Joi validation middleware
const validateReview = (req, res, next) => {
    if (!req.body.review) {
        throw new ExpressError(400, "Review data is missing");
    }
    const { error } = reviewSchema.validate(req.body.review);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewControllers.destroyReview));

module.exports = router;
