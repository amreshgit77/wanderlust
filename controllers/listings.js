const Listing = require("../models/listing");
const { uploadToCloudinary } = require("../cloudConfig"); // Uses buffer upload
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = "pk.eyJ1IjoiYW1ydTc3IiwiYSI6ImNtajBjMjZoczA2cnozZnNibWM4OXY3ZDcifQ.73Nd8Q9NIsWZpoRKMmfgqw";
const geocodingClient  = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing,mapToken: process.env.MAPBOX_TOKEN, });
};

//  Corrected version for Cloudinary buffer upload
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

    

  try {
    if (!req.file) {
      req.flash("error", "Please upload an image");
      return res.redirect("/listings/new");
    }

    //  Upload image to Cloudinary using buffer
    console.log("Uploading file to Cloudinary...");
    const result = await uploadToCloudinary(req.file.buffer); //  buffer 

    //  Create listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
      url: result.secure_url, //  actual Cloudinary image URL
      filename: result.public_id, //  unique Cloudinary file ID
    };
    newListing.geometry = response.body.features[0].geometry;

    let ans = await newListing.save();

    console.log(ans);

    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Image upload failed. Please try again.");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upoads/", "/uploads/w_200/"); // Example transformation to resize image
  
    res.render("listings/edit.ejs", { originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }


  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);

    listing.image = {
      url: result.secure_url,
      filename: result.public_id,
    };

    await listing.save();
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
