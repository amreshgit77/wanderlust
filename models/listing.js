const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({

  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default: "https://unsplash.com/photos/a-cowboy-sits-on-his-horse-in-the-desert-9nqNQLfn5B4",
      set: (v) => v === "" ? "https://unsplash.com/photos/a-cowboy-sits-on-his-horse-in-the-desert-9nqNQLfn5B4" : v,
    },
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

});

// models/Listing.js


listingSchema.post('findOneAndDelete', async (listing) =>{
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
