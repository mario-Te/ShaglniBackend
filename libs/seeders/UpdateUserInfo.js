const UserInfo = require("../models/UserInfo"); // Assuming UserInfo model is in a file called UserInfo.js
const User = require("../models/User");
const ConnectDb = require("../../db");

async function UpdateInfo() {
  try {
    ConnectDb();
    const userInfoData = {
      user: "66170ed2940c71c3399ad22f",
      first_name: "Hasan",
      last_name: "Meree",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      skills: { Node: 50, React: 40 }, // Adjusted skills format
      experience: 10,
      education: "Bachelor of Science in Computer Science",
      image: "https://example.com/image1.jpg",
    };
    // Add more user info data as needed
    const userInfo = new UserInfo(userInfoData);
    const savedUserInfo = await userInfo.save();
    console.log("User Info added successfully ");
  } catch (error) {
    console.error("Error updating user info:", error);
  }
}

UpdateInfo();
