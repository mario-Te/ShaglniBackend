const Company = require("../models/Company");
const ConnectDb = require("../../db");

async function UpdateInfo() {
  try {
    ConnectDb();

    // check company Info
    const companies = await Company.find();

    console.log("Company " + companies);
  } catch (error) {
    console.error("Error :", error);
  }
}

UpdateInfo();
