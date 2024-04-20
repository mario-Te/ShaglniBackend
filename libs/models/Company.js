const mongoose = require("mongoose");

const User = require("./User");
// Define the schema for the company collection
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Assuming storing image URL as string
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialization",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for owners
  },
});

// Create a model for the "companies" collection based on the schema
const Company = mongoose.model("Company", companySchema);

module.exports = Company;
