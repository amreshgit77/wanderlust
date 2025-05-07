let express = require("express");
let app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// using middleware for listing used in new.ejs 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const port = 8080;

main().then((res) => {
    console.log("connection established");
}).
    catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MongoURL);

}

// get all data from database------->
app.get("/listings", async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index", { allListing });
});

// create new list for hotel

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})
// get the more deatils about each hotel 

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/show.ejs", { listing });
}
);

// recive data from new.ejs and post to index.ejs

app.post("/listings", async (req, res) => {
    //let {title,description,image,price,location,country} = req.body;

    //let listing = req.body;
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    //console.log(listing);
    res.redirect("/listings");

});

// edit current list----->
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });
});

// edit and update list ----->

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
});

//deleting a listing

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


// app.get("/data", (req, res) => {
//     let listing1 = new Listing({
//         title: "my new villa",
//         decription: "my new villa is worth of 20 cr",
//         price: 20000,
//         location: "sitapura , jaipur",
//         country: "india"
//     });

//     listing1.save().then((res) => {
//         console.log(res);
//     })
//         .catch((err) => {
//             console.log(err);
//         })

//     res.send("data saved");
// })





app.get("/", (req, res) => {
    res.send("working");
})
app.listen(port, () => {
    console.log("listening on port 8080");
})