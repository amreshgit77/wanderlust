const mongoose = require("mongoose");
const Data = require("./data.js");
const Listing = require("../models/listing.js");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("connection established");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MongoURL);
}

async function saveData() {
  await Listing.deleteMany({});

  const ownerId = new mongoose.Types.ObjectId("68a36962ea1e2288bd52e111"); 

  Data.data = Data.data.map((obj) => ({
    ...obj,
    owner: ownerId,
  }));

  await Listing.insertMany(Data.data);

  console.log("data is inserted");
}

saveData();
