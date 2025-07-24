const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

const app = express();
const port = 8080;
const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

main().then(() => console.log("MongoDB connected")).catch(console.log);
async function main() {
    await mongoose.connect(MongoURL);
}

// Home route
app.get("/", (req, res) => {
    res.send("Server is working");
});

// Route usage
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
