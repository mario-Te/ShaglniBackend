const mongoose = require("mongoose");
const { Variables } = require("../config/constant");
// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date, // Assuming birthdate is a Date
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Specialization model
    ref: "Specialization",
  },

  role: {
    type: String,
    enum: [Variables.Roles.user, Variables.Roles.admin], // Assuming 'user' and 'admin' are the possible roles
    default: "user", // Default role is 'user'
  },
});

// Create a User model based on the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
