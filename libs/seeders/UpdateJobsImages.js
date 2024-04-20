const mongoose = require('mongoose');
const Job = require('../models/Jobs');
const ConnectDb = require('../../db');

async function UpdateImages() {
  try {
    ConnectDb(); // Connect to the database

    const jobs = await Job.find();
    const images = [
      'flat-design-job-vacancy-background-we-are-hiring-recruitment-illustration-with-silhouette-of-businessman-free-vector.jpg',
      'job-hiring-and-online-recruitment-for-web-landing-page-banner-background-presentation-or-social-media-illustration-vector.jpg',
      'hiring-career-employee-message-background-employment-hiring-job-recruitment-concept-banner-hiring-career-employee-167578075.jpg',
      '8180b8e0a07264cc3dd8bd4accba63de.jpg'
    ];

   
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const imageIndex = i % images.length; // Get the index of the image based on the current job index

      await Job.updateOne({ _id: job._id }, { image: images[imageIndex] });
      console.log(`Job ${job._id} updated with image ${images[imageIndex]}`);
    }

    console.log(`Updated ${jobs.length} job(s) with random images`);
  } catch (error) {
    console.error('Error updating jobs:', error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
  }
}

// Call the function to update jobs
UpdateImages();