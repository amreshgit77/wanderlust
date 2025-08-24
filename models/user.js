const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Adds username, hash, salt fields, and auth methods to the schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
