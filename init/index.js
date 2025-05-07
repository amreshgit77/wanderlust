const mongoose = require("mongoose");
const Data = require("./data.js");
const Listing = require("../models/listing.js");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";

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

async function saveData() {
     await Listing.deleteMany({});
    await  Listing.insertMany(Data.data);

    console.log("data is inserted");

}

saveData();