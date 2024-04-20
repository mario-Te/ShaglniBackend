const Job = require("../models/Jobs");
const ConnectDb = require("../../db");

async function updateJobDates() {
  try {
    ConnectDb();
    const jobs = await Job.find({});
    const updatePromises = jobs.map(async (job) => {
      const randomDate = new Date(
        new Date(2024, 3, 1).getTime() +
          Math.random() *
            (new Date(2024, 3, 15).getTime() - new Date(2024, 3, 1).getTime())
      );
      job.createdAt = randomDate;
      await job.save();
    });
    await Promise.all(updatePromises);
    console.log(`${jobs.length} jobs updated successfully.`);
  } catch (error) {
    console.error("Error updating job dates:", error);
  }
}

updateJobDates();
