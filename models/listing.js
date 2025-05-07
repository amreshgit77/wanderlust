const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({

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

});


const Listing = mongoose.model("Listing",listingschema);

module.exports = Listing;
