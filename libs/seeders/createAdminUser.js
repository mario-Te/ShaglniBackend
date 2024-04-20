const User = require("../models/User");
const { Variables } = require("../config/constant");
const ConnectDb = require("../../db");
const bcrypt = require("bcryptjs");

async function createAdminUser() {
  try {
    ConnectDb();
    password = "ABZxwq_P@dcJWAr16";
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      username: "admin",
      email: "admin@shaglni.com",
      password: hashedPassword,
      role: Variables.Roles.admin,
    });
    await adminUser.save();
    console.log("admin is saved");
  } catch (error) {
    console.error("Error :", error);
  }
}

createAdminUser();
