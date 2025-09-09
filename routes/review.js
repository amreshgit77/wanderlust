const express = require("express");
const router = express.Router({ mergeParams: true });


const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

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

router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "Review added!");

    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;
