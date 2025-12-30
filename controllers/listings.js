const Listing = require("../models/listing");
const { uploadToCloudinary } = require("../cloudConfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapBoxToken = "pk.eyJ1IjoiYW1ydTc3IiwiYSI6ImNtajBjMjZoczA2cnozZnNibWM4OXY3ZDcifQ.73Nd8Q9NIsWZpoRKMmfgqw";
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

/* INDEX */
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
};

/* NEW FORM */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

/* SHOW */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {
    listing,
    mapToken: mapBoxToken,
  });
};

/* CREATE */
module.exports.createListing = async (req, res) => {
  try {
    if (!req.file) {
      req.flash("error", "Please upload an image");
      return res.redirect("/listings/new");
    }

    const geoResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
      url: cloudinaryResult.secure_url,
      filename: cloudinaryResult.public_id,
    };
    newListing.geometry = geoResponse.body.features[0].geometry;

    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings/new");
  }
};

/* EDIT FORM */
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // optional image transformation
  let originalImageUrl = listing.image.url.replace(
    "/upload/",
    "/upload/w_200/"
  );

  res.render("listings/edit.ejs", {
    listing,
    originalImageUrl,
  });
};

/* UPDATE */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true }
  );

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

/* DELETE */
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
