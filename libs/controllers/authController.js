const User = require("../models/User");
const Company = require("../models/Company");
const UserInfo = require("../models/UserInfo");
const ResponseHelper = require("../helpers/ResponseHelper");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Variables } = require("../config/constant");

exports.registerUser = async (req, res) => {
  const { username, email, password, birthdate, specialization } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Username is Duplicated"));
    }
    user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Email is Duplicated"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      birthdate, // Assigning birthdate
      specialization,
    });
    const accessToken = jwt.sign(
      { username, role: Variables.Roles.user },
      process.env.JWT_TOKEN_SECRET
    );
    // Save the new user to the database
    const savedUser = await newUser.save();
    const savedUserWithoutPassword = savedUser.toObject({
      getters: true,
      versionKey: false,
    });
    delete savedUserWithoutPassword.password;
    const userInfo = new UserInfo({ user: savedUserWithoutPassword._id });
    await userInfo.save();
    return res.status(200).json(
      ResponseHelper.successResponse({
        accessToken,
        user: savedUserWithoutPassword,
      })
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.loginAdmin = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    // Check if user exists by email
    let user = await User.findOne({ email: emailOrUsername });

    // If user does not exist by email, check by username
    if (!user) {
      user = await User.findOne({ username: emailOrUsername });
    }

    if (!user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }
    if (user.role != Variables.Roles.admin) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }
    // Generate JWT token
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_TOKEN_SECRET
    );
    const savedUserWithoutPassword = user.toObject({
      getters: true,
      versionKey: false,
    });
    delete savedUserWithoutPassword.password;
    return res.status(200).json(
      ResponseHelper.successResponse({
        accessToken,
        user: savedUserWithoutPassword,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Check if user exists by email
    let user = await User.findOne({ email: emailOrUsername });

    // If user does not exist by email, check by username
    if (!user) {
      user = await User.findOne({ username: emailOrUsername });
    }

    if (!user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_TOKEN_SECRET
    );
    const savedUserWithoutPassword = user.toObject({
      getters: true,
      versionKey: false,
    });
    delete savedUserWithoutPassword.password;
    return res.status(200).json(
      ResponseHelper.successResponse({
        accessToken,
        user: savedUserWithoutPassword,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.registerCompany = async (req, res) => {
  const { name, email, password, specializations, location } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }
    let company = await Company.findOne({ email });
    if (company) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }
    company = await Company.findOne({ name });
    if (company) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = new Company({
      name,
      email,
      password: hashedPassword,
      location, // Assigning Location
      type: specializations,
    });
    const savedCompany = await newCompany.save();
    const savedCompanyWithoutPassword = savedCompany.toObject({
      getters: true,
      versionKey: false,
    });
    delete savedCompanyWithoutPassword.password;
    const accessToken = jwt.sign(
      { name, role: Variables.Roles.company },
      process.env.JWT_TOKEN_SECRET
    );

    return res.status(200).json(
      ResponseHelper.successResponse({
        accessToken,
        company: savedCompanyWithoutPassword,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.LoginCompany = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Check if user exists by email
    let company = await Company.findOne({ email: emailOrUsername });

    // If company does not exist by email, check by username
    if (!company) {
      company = await Company.findOne({ username: emailOrUsername });
    }

    if (!company) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid credentials"));
    }

    // Verify password

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const passwordMatch = await bcrypt.compare(password, company.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Invalid password"));
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { name: company.name, role: Variables.Roles.company },
      process.env.JWT_TOKEN_SECRET
    );
    const savedCompanyWithoutPassword = company.toObject({
      getters: true,
      versionKey: false,
    });
    delete savedCompanyWithoutPassword.password;
    return res.status(200).json(
      ResponseHelper.successResponse({
        accessToken,
        company: savedCompanyWithoutPassword,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
