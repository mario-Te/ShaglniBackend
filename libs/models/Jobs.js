const mongoose = require("mongoose");
const Company = require("./Company");
const User = require("./User");
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  applicants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId, // Ensure userId is an ObjectId
        ref: "User", // Reference to the User model
      },
      fileName: String,
    },
  ],
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
