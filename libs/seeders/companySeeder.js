const mongoose = require('mongoose');
const Company = require('../models/Company');
const User = require('../models/User');
const ConnectDb = require("../../db");
async function seedCompanies() {
  try {
    // Connect to MongoDB Atlas
    ConnectDb();
    // Get all users from the database
    const users = await User.find();

    // Dummy data for companies
    
    const companies = [
        {
          name: 'ABC Plumbing Services',
          location: '123 Main Street, Cityville',
          email: 'info@abcplumbing.com',
          password: 'abcplumbingpass',
          type: 'Plumber',
          
        },
        {
          name: 'City Barbershop',
          location: '456 Oak Avenue, Townsville',
          email: 'info@citybarbershop.com',
          password: 'citybarberpass',
          type: 'Barber',
        },
        {
          name: 'Forge Masters Inc.',
          location: '789 Maple Drive, Villageton',
          email: 'info@forgemasters.com',
          password: 'forgemasterspass',
          type: 'Blacksmith',
        },
        {
          name: 'WoodCrafters Co.',
          location: '101 Pine Lane, Hamletville',
          email: 'info@woodcrafters.com',
          password: 'woodcrafterspass',
          type: 'Wood Maker',
        },
        {
          name: 'Bright Spark Electrical Solutions',
          location: '321 Elm Street, Boroughburg',
          email: 'info@brightspark.com',
          password: 'brightsparkpass',
          type: 'Electrician',
        }
      ];

    // Loop through each company and assign a random owner from the users
    for (const companyData of companies) {
      // Randomly select an owner from the users array
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // Assign the user's ID as the owner of the company
      companyData.owner = randomUser._id;

      // Create a new company using the company data
      const newCompany = new Company(companyData);

      // Save the company to the database
      await newCompany.save();

      console.log('Company seeded successfully:', newCompany);
    }

    console.log('All companies seeded successfully');
  } catch (error) {
    console.error('Error seeding companies:', error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Call the function to seed companies
seedCompanies();
