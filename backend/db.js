const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sid:abcdefghi@cluster1.fdvia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1");

const userSchema = new mongoose.Schema(
   { username: String,
     password: String,
     email: String,
     birthDate: String,
   }
);

const accountSchema =  new mongoose.Schema(
  {
      userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
      },
      Reviews: String,
  }

)

const bookSchema = new mongoose.Schema(
  {
    title: String,
    genre: String,
    review: String,
    rating: Number,
  }
)
const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
const Book = mongoose.model("Book", bookSchema);
module.exports = {
    User,
    Account,
    Book
}