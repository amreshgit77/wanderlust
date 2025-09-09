const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



// Routes
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
}));

router.get("/new", isLoggedIn, (req, res) => {
    // req.flash("success", "New listing added successfully!");

    res.render("listings/new.ejs");
});

router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    res.redirect("/listings");
}));


router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/show.ejs", { listing });
}));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing updated successfully!");
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;
