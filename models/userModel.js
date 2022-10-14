const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a name"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide an email"],
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;