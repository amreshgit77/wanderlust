const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const passport = require("passport");

const app = express();
const port = 8080;
const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";

// Session config
const sessionOptions = {
    // store: MongoStore.create({
    //     mongoUrl: MongoURL,
    //     crypto: {
    //         secret: 'thisshouldbeabettersecret',
    //     },
    //     touchAfter: 24 * 3600, // time period in seconds
    // }),
    // name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // enable in production with HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions)); // Add session middleware

// MongoDB connection
main().then(() => console.log("MongoDB connected")).catch(console.log);
async function main() {
    await mongoose.connect(MongoURL);
}

// Home route
app.get("/", (req, res) => {
    res.send("Server is working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Route usage
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Server start
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
