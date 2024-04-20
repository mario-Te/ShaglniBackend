const Job = require("../models/Jobs");
const ConnectDb = require("../../db");

async function deleteAllApplicants() {
  try {
    ConnectDb();
    const result = await Job.updateMany({}, { $set: { applicants: [] } });
    console.log(`${result.nModified} jobs updated successfully.`);
  } catch (error) {
    console.error("Error deleting applicants:", error);
  }
}

deleteAllApplicants();
