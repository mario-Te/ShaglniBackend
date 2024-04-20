const mongoose = require('mongoose');

// Define the specialization schema
const specializationSchema = new mongoose.Schema({
  name_en: {
    type: String,
    required: true,
    unique: true
  },
  name_ar: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  // You can add more fields as needed, such as price, location, etc.
});

// Create a Specialization model based on the schema
const Specialization = mongoose.model('Specialization', specializationSchema);

// Export the Specialization model
module.exports = Specialization;
