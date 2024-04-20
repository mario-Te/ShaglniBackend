const UserInfo = require("../models/UserInfo");
const Company = require("../models/Company");
const ResponseHelper = require("../helpers/ResponseHelper");
const jwt = require("jsonwebtoken");
const ObjectHelper = require("../helpers/ObjectHelper");
const User = require("../models/User");
exports.getUserData = async (req, res) => {
  try {
    const userId = req.query.user;
    const userInfo = await UserInfo.findOne({ user: userId }).populate({
      path: "user",
      select: "-password", // Exclude the 'password' field of the user document
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        userInfo: ObjectHelper.formatInfo(userInfo),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.getCompanyData = async (req, res) => {
  try {
    const companyId = req.query.company;
    const companyInfo = await Company.findById(companyId).populate("type");
    const savedCompanyWithoutPassword = companyInfo.toObject({
      getters: true,
      versionKey: false,
    });
    if (savedCompanyWithoutPassword.image)
      savedCompanyWithoutPassword.image = `${process.env.API_Domain}:uploads/images/${savedCompanyWithoutPassword.image}`;
    delete savedCompanyWithoutPassword.password;
    return res.status(200).json(
      ResponseHelper.successResponse({
        companyInfo: savedCompanyWithoutPassword,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};

exports.getPersonalData = async (req, res) => {
  try {
    if (req.company) {
      const companyId = req.company._id;

      const companyInfo = await Company.findById(companyId).populate("type");
      const savedCompanyWithoutPassword = companyInfo.toObject({
        getters: true,
        versionKey: false,
      });
      if (savedCompanyWithoutPassword.image)
        savedCompanyWithoutPassword.image = `${process.env.API_Domain}uploads/images/${savedCompanyWithoutPassword.image}`;
      delete savedCompanyWithoutPassword.password;
      return res.status(200).json(
        ResponseHelper.successResponse({
          companyInfo: savedCompanyWithoutPassword,
        })
      );
    }
    if (req.user) {
      const userId = req.user._id;
      const userInfo = await UserInfo.findOne({ user: userId }).populate({
        path: "user",
        select: "-password", // Exclude the 'password' field of the user document
      });
      return res.status(200).json(
        ResponseHelper.successResponse({
          userInfo: ObjectHelper.formatInfo(userInfo),
        })
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.updateSkills = async (req, res) => {
  try {
    const userId = req.user._id;
    const newskills = req.body.formSkills.map((skill) => [
      skill[0],
      parseInt(skill[1]),
    ]);
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: userId },
      { $set: { skills: newskills } }
    );
    return res.status(200).json(ResponseHelper.successResponse({ userInfo }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.updateBio = async (req, res) => {
  try {
    const userId = req.user._id;
    const bio = req.body.bio;
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: userId },
      { $set: { bio } }
    );
    return res.status(200).json(ResponseHelper.successResponse({ userInfo }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.updateEducation = async (req, res) => {
  try {
    const userId = req.user._id;
    const education = req.body.education;
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: userId },
      { $set: { education } }
    );
    return res.status(200).json(ResponseHelper.successResponse({ userInfo }));
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.updateImage = async (req, res) => {
  try {
    if (req.company) {
      const companyId = req.company._id;
      const imageName = req.file.filename;
      const companyInfo = await Company.findOneAndUpdate(
        { _id: companyId },
        { $set: { image: imageName } },
        { new: true }
      );
      const savedCompanyWithoutPassword = companyInfo.toObject({
        getters: true,
        versionKey: false,
      });
      if (savedCompanyWithoutPassword.image)
        savedCompanyWithoutPassword.image = `${process.env.API_Domain}uploads/images/${savedCompanyWithoutPassword.image}`;
      delete savedCompanyWithoutPassword.password;
      return res.status(200).json(
        ResponseHelper.successResponse({
          userInfo: savedCompanyWithoutPassword,
        })
      );
    }
    const userId = req.user._id;
    const imageName = req.file.filename;
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: userId },
      { $set: { image: imageName } },
      { new: true }
    );
    const savedInfoWithoutPassword = userInfo.toObject({
      getters: true,
      versionKey: false,
    });
    if (savedInfoWithoutPassword.image)
      savedInfoWithoutPassword.image = `${process.env.API_Domain}uploads/images/${savedInfoWithoutPassword.image}`;
    delete savedInfoWithoutPassword.password;
    return res
      .status(200)
      .json(
        ResponseHelper.successResponse({ userInfo: savedInfoWithoutPassword })
      );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.updateBasicInfo = async (req, res) => {
  try {
    if (req.company) {
      const companyId = req.company._id;
      const { location, email } = req.body;
      existed_company = await Company.findOne({ email });
      // check if there's no duplication in email
      if (
        existed_company != null &&
        existed_company._id.toString() != companyId
      ) {
        return res
          .status(400)
          .json(ResponseHelper.badResponse("Invalid email credentials"));
      }
      let company = await Company.findOneAndUpdate(
        { _id: companyId },
        { $set: { location, email } },
        { new: true }
      );

      company = company.toObject({
        getters: true,
        versionKey: false,
      });
      delete company.password;

      company.image = `${process.env.API_Domain}uploads/images/${company.image}`;

      return res.status(200).json(ResponseHelper.successResponse({ company }));
    }
    const userId = req.user._id;
    const { first_name, last_name, experience, email, birthdate } = req.body;
    let user = await User.findOne({ _id: { $ne: userId }, email });
    if (user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }
    await UserInfo.findOneAndUpdate(
      { user: userId },
      { $set: { first_name, last_name, experience } },
      { new: true }
    );
    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      { email, birthdate: new Date(birthdate) }
    );
    return res.status(200).json(ResponseHelper.successResponse());
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
