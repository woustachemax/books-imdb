const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sid:abcdefghi@cluster1.fdvia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1");

const userSchema = new mongoose.Schema(
   { username: String,
     password: String,
     email: String,
     birthDate: String,
   }
);

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}