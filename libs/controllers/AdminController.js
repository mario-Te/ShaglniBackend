const UserInfo = require("../models/UserInfo");
const User = require("../models/User");
const Company = require("../models/Company");
const ResponseHelper = require("../helpers/ResponseHelper");
const bcrypt = require("bcryptjs");
const ObjectHelper = require("../helpers/ObjectHelper");
const Jobs = require("../models/Jobs");
const Job = require("../models/Jobs");

exports.getUsersAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page

    // Calculate the whole documents in job Collection
    const skip = (page - 1) * limit;
    const length = (await UserInfo.find()).length;
    let count = 0;
    if (length % 10 == 0) {
      count = parseInt(length / limit);
    } else count = parseInt(length / limit) + 1;
    const users = await UserInfo.find()
      .populate({
        path: "user",
        select: "-password", // Exclude the 'password' field of the company document
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    let modifiedusers = [];
    users.map((user) => {
      let modifieduser = {};
      modifieduser._id = user._id || "";
      modifieduser.bio = user.bio || "";
      modifieduser.username = user.user.username || "";
      modifieduser.email = user.user.email || "";
      modifieduser.first_name = user.first_name || "";
      modifieduser.last_name = user.last_name || "";
      modifiedusers.push(modifieduser);
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        users: modifiedusers,
        count,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getUserAdmin = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await UserInfo.findOne({ _id: id }).populate({
      path: "user",
      // Exclude the 'password' field of the company document
    });
    console.log(user);
    let formattedUser = {};
    formattedUser.email = user.user.email;
    formattedUser.password = user.user.password;
    formattedUser.firstName = user.first_name;
    formattedUser.lastName = user.last_name;
    formattedUser.userName = user.user.username;
    formattedUser.birthdate = user.user.birthdate;
    return res.status(200).json(
      ResponseHelper.successResponse({
        user: formattedUser,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getAllCompaniesAdmin = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(
      ResponseHelper.successResponse({
        companies,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getCompanyAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page

    // Calculate the whole documents in job Collection
    const skip = (page - 1) * limit;
    const length = (await Company.find()).length;
    let count = 0;
    if (length % 10 == 0) {
      count = parseInt(length / limit);
    } else count = parseInt(length / limit) + 1;
    const companies = await Company.find()
      .populate({
        path: "type",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    let modifiedCompanies = [];
    companies.map((company) => {
      let modifiedCompany = {};
      modifiedCompany._id = company._id || "";
      modifiedCompany.name = company.name || "";
      modifiedCompany.location = company.location || "";
      modifiedCompany.email = company.email || "";

      modifiedCompany.Specilization =
        company.type?.name_en || company.type?.name_ar || "";

      modifiedCompanies.push(modifiedCompany);
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        companies: modifiedCompanies,
        count,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getJobAdmin = async (req, res) => {
  try {
    const id = req.query.id;
    const job = await Jobs.findById(id).populate({
      path: "company",
    });

    let modifiedjob = {};
    modifiedjob._id = job._id || "";
    modifiedjob.company = job.company;
    modifiedjob.createdAt = job.createdAt;
    modifiedjob.title = job.title;
    modifiedjob.description = job.description;
    modifiedjob.deadline = job.deadline;
    modifiedjob.tags = job.tags;

    return res.status(200).json(
      ResponseHelper.successResponse({
        job: modifiedjob,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getJobsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page

    // Calculate the whole documents in job Collection
    const skip = (page - 1) * limit;
    const length = (await Jobs.find()).length;
    let count = 0;
    if (length % 10 == 0) {
      count = parseInt(length / limit);
    } else count = parseInt(length / limit) + 1;
    const jobs = await Jobs.find()
      .populate({
        path: "company",
        select: "-password", // Exclude the 'password' field of the company document
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    let modifiedJobs = [];
    jobs.map((job) => {
      let modifiedjob = {};
      modifiedjob._id = job._id || "";
      modifiedjob.company = job.company?.name || "";
      modifiedjob.createdAt = ObjectHelper.formatDateTime(job.createdAt) || "";
      modifiedjob.title = job.title;
      modifiedjob.description = job.description;
      modifiedjob.deadline = ObjectHelper.formatDateTime(job.deadline) || "";
      modifiedJobs.push(modifiedjob);
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        jobs: modifiedJobs,
        count,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getSingleCompanyAdmin = async (req, res) => {
  const id = req.query.id;
  try {
    let company = await Company.findOne({ _id: id }).populate("type");
    return res.status(200).json(
      ResponseHelper.successResponse({
        company,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getApplicantAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page

    // Calculate the total number of documents in the Job collection
    const length = await Jobs.countDocuments();
    const count = Math.ceil(length / limit); // Calculate the total number of pages

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch jobs with applicants populated
    const jobs = await Jobs.find()
      .populate({
        path: "applicants.userId",
        select: "username",
      })
      .skip(skip)
      .limit(limit);

    // Format the response data
    let formattedData = [];
    jobs.forEach((job) => {
      job.applicants.forEach((applicant) => {
        if (applicant.userId?.username != undefined)
          formattedData.push({
            _id: job._id,
            jobTitle: job.title,
            username: applicant.userId?.username,
            filename: applicant?.fileName || "",
          });
      });
    });

    return res.status(200).json(
      ResponseHelper.successResponse({
        jobs: formattedData,
        count,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const id = req.query.id.toString();
    await Jobs.deleteMany({ company: id });
    await Company.findByIdAndDelete(id);
    return res
      .status(200)
      .json(ResponseHelper.successResponse("Company is successfully deleted"));
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.deleteJob = async (req, res) => {
  try {
    const id = req.query.id.toString();
    await Job.findByIdAndDelete(id);
    return res
      .status(200)
      .json(ResponseHelper.successResponse("Company is successfully deleted"));
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.deleteApplicant = async (req, res) => {
  try {
    const id = req.query.id.toString();
    const username = req.query.username.toString();
    const job = await Jobs.findById(id);
    const user = await User.findOne({ username: username });
    const user_id = user._id.toString();
    let index = job.applicants.findIndex(
      (applicant) => applicant.userId == user_id
    );

    job.applicants.splice(index, 1);
    job.save();
    return res
      .status(200)
      .json(ResponseHelper.successResponse("Company is successfully deleted"));
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const id = req.query.id.toString();
    const username = req.query.username;
    await UserInfo.findByIdAndDelete(id);
    const deletedUser = await User.findOneAndDelete({ username: username });
    await Job.updateMany(
      { "applicants.userId": id },
      { $pull: { applicants: { userId: deletedUser._id } } }
    );
    return res
      .status(200)
      .json(ResponseHelper.successResponse("User is successfully deleted"));
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.createUser = async (req, res) => {
  const { email, password, username, first_name, last_name, birthdate } =
    req.body;
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
    });

    // Save the new user to the database
    await newUser.save();
    const userInfo = new UserInfo({ user: newUser._id, first_name, last_name });
    await userInfo.save();
    return res.status(200).json(
      ResponseHelper.successResponse({
        user: userInfo,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.createJob = async (req, res) => {
  const { company, deadline, tags, title, description } = req.body;
  try {
    const images = [
      "flat-design-job-vacancy-background-we-are-hiring-recruitment-illustration-with-silhouette-of-businessman-free-vector.jpg",
      "job-hiring-and-online-recruitment-for-web-landing-page-banner-background-presentation-or-social-media-illustration-vector.jpg",
      "hiring-career-employee-message-background-employment-hiring-job-recruitment-concept-banner-hiring-career-employee-167578075.jpg",
      "8180b8e0a07264cc3dd8bd4accba63de.jpg",
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const job = await Jobs.create({
      company,
      title,
      tags,
      description,
      deadline: new Date(deadline),
      image: randomImage,
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        job,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.createCompany = async (req, res) => {
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

    return res.status(200).json(
      ResponseHelper.successResponse({
        company: savedCompany,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(ResponseHelper.badResponse(err));
  }
};
exports.UpdateUser = async (req, res) => {
  const id = req.query.id;
  const { email, password, username, firstName, lastName, birthdate } =
    req.body;

  try {
    let userInfo = await UserInfo.findById(id);
    let user = await User.findOne({
      _id: { $ne: userInfo.user._id },
      username,
    });
    if (user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Username is Duplicated"));
    }
    user = await User.findOne({ _id: { $ne: userInfo.user._id }, email });
    if (user) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Email is Duplicated"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let modifiedUser = await User.findOneAndUpdate(
      { _id: userInfo.user._id },
      {
        $set: {
          username,
          email,
          password: hashedPassword,
          birthdate, // Assigning birthdate
        },
      },
      { new: true }
    );
    await modifiedUser.save();
    let modifiedUserInfo = await UserInfo.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          last_name: lastName,
          first_name: firstName,
        },
      },
      { new: true }
    );
    modifiedUserInfo.save();
    return res.status(200).json(
      ResponseHelper.successResponse({
        user: userInfo,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.UpdateJob = async (req, res) => {
  const id = req.query.id;
  const { company, title, description, deadline, tags } = req.body;

  try {
    let modifiedJob = await Job.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          company,
          title,
          description,
          deadline,
          tags,
        },
      },
      { new: true }
    );
    modifiedJob.save();
    return res.status(200).json(
      ResponseHelper.successResponse({
        job: modifiedJob,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.UpdateCompany = async (req, res) => {
  const id = req.query.id;
  const { email, location, name, password, specializations } = req.body;

  try {
    let existed_company = await Company.findOne({
      _id: { $ne: id },
      email,
    });
    if (existed_company) {
      return res
        .status(400)
        .json(ResponseHelper.badResponse("Email is Duplicated"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let modifiedCompany = await Company.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          email,
          password: hashedPassword,
          location, // Assigning Location
          type: specializations,
        },
      },
      { new: true }
    );
    modifiedCompany.save();
    return res.status(200).json(
      ResponseHelper.successResponse({
        company: modifiedCompany,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
