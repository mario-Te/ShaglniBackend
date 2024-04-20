// Import required modules
const mongoose = require("mongoose");

// Define schema for UserInfo
const userInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  bio: {
    type: String,
  },
  experience: {
    type: Number,
  },
  skills: {
    type: Map, // Using Map data type to store key-value pairs
    of: Number, // Values will be numbers representing proficiency level
  },
  education: {
    type: String,
  },
  image: {
    type: String, // Assuming storing image URL as string
  },
});

// Create UserInfo model
const UserInfo = mongoose.model("UserInfo", userInfoSchema);

// Export UserInfo model
module.exports = UserInfo;
