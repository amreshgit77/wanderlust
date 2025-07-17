// Required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Models and utilities
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const app = express();
const port = 8080;
const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// DB connection
main()
    .then(() => console.log("MongoDB connection established"))
    .catch((err) => console.log("MongoDB error:", err));

async function main() {
    await mongoose.connect(MongoURL);
}

// Joi validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }
//     next();
// };

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

// ROUTES

// Home page
app.get("/", (req, res) => {
    res.send("Server is working");
});

// Get all listings
app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        const allListing = await Listing.find({});
        res.render("listings/index", { allListing });
    })
);

// Form to create a new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create a new listing
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// Show details of a specific listing
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        if (!listing) throw new ExpressError(404, "Listing not found");
        res.render("listings/show.ejs", { listing });
    })
);

// Form to edit a listing
app.get(
    "/listings/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) throw new ExpressError(404, "Listing not found");
        res.render("listings/edit.ejs", { listing });
    })
);

// Update a listing
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect("/listings");
    })
);

// Delete a listing
app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    })
);

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review 
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

/*app.get("/data", (req, res) => {
    let listing1 = new Listing({
        title: "my new villa",
        decription: "my new villa is worth of 20 cr",
        price: 20000,
        location: "sitapura , jaipur",
        country: "india"
    }));

    listing1.save().then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })

res.send("data saved");
*/

// })
// 404 handler for unknown routes
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// General error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
