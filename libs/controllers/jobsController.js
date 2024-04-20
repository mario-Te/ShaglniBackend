const multer = require("multer");
const path = require("path");
const Jobs = require("../models/Jobs");
const ResponseHelper = require("../helpers/ResponseHelper");
const ObjectHelper = require("../helpers/ObjectHelper");
const NotificationHelper = require("../helpers/NotificationHelper");
const { Variables } = require("../config/constant");
const Job = require("../models/Jobs");

exports.getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page

    // Calculate the whole documents in job Collection
    const skip = (page - 1) * limit;

    const jobs = await Jobs.find({ company: { $ne: null } })
      .populate({
        path: "company",
        select: "-password", // Exclude the 'password' field of the company document
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const length = ObjectHelper.formatJobs(jobs).length;
    let count = 0;
    if (length % 10 == 0) {
      count = parseInt(length / limit);
    } else count = parseInt(length / limit) + 1;
    return res.status(200).json(
      ResponseHelper.successResponse({
        jobs: ObjectHelper.formatJobs(jobs),
        count,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.searchJob = async (req, res) => {
  try {
    const searchTerm = req.query.job;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 jobs per page

    // Calculate the skip value based on the page number and limit
    const skip = (page - 1) * limit;
    const condition = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } }, // Search by job title (case-insensitive)
        { tags: { $in: [searchTerm] } }, // Search by tags
      ],
    };
    const jobs = await Jobs.find(condition)
      .populate({
        path: "company",
        select: "-password", // Exclude the 'password' field of the company document
      })
      .skip(skip)
      .limit(limit);
    let count = 0;
    const length = jobs.length;
    if (length % 10 == 0) {
      count = parseInt(length / limit);
    } else count = parseInt(length / limit) + 1;

    return res.status(200).json(
      ResponseHelper.successResponse({
        jobs: ObjectHelper.formatJobs(jobs),
        count,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getSingleJob = async (req, res) => {
  try {
    const id = req.query.job;
    const job = await Jobs.findById(id).populate({
      path: "company",
      select: "-password",
      populate: {
        path: "owner",
      },
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        job: ObjectHelper.formatJob(job),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.apply = async (req, res) => {
  try {
    const jobId = req.query.job;
    const userId = req.user._id;
    const job = await Jobs.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json(ResponseHelper.badResponse({ message: "Job not found" }));
    }
    job.applicants.forEach((applicant) => {
      if (applicant.userId.toString() == userId)
        throw "You have already applied for this job";
    });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileName = req.file.filename;
    job.applicants.push({ userId, fileName });
    const appliendNotificationTemplate =
      NotificationHelper.composeNotificationTemplate(
        Variables.NotificationType.applied,
        job.title
      );
    const userNotification = NotificationHelper.createUserNotification(
      appliendNotificationTemplate.title,
      appliendNotificationTemplate.message,
      Variables.NotificationType.applied,
      [userId]
    );
    let { title, message } = NotificationHelper.composeNotificationTemplate(
      Variables.NotificationType.applicant,
      job.title
    );
    const companyNotification = NotificationHelper.createCompanyNotification(
      title,
      message,
      Variables.NotificationType.applicant,
      [job.company._id]
    );
    // Save the updated job document
    await job.save();

    return res.status(200).json(ResponseHelper.successResponse());
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getGuestCompanyJobs = async (req, res) => {
  try {
    const companyId = req.query.company;
    const jobs = await Jobs.find({ company: companyId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        jobs: ObjectHelper.formatJobs(jobs),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Jobs.find({ company: companyId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        jobs: ObjectHelper.formatJobs(jobs),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.create = async (req, res) => {
  try {
    const images = [
      "flat-design-job-vacancy-background-we-are-hiring-recruitment-illustration-with-silhouette-of-businessman-free-vector.jpg",
      "job-hiring-and-online-recruitment-for-web-landing-page-banner-background-presentation-or-social-media-illustration-vector.jpg",
      "hiring-career-employee-message-background-employment-hiring-job-recruitment-concept-banner-hiring-career-employee-167578075.jpg",
      "8180b8e0a07264cc3dd8bd4accba63de.jpg",
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const { title, tags, description, deadline } = req.body;
    const companyId = req.company._id;
    const job = await Jobs.create({
      company: companyId,
      title,
      tags,
      description,
      deadline: new Date(deadline),
      image: randomImage,
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        job: ObjectHelper.formatJob(job),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.UpdateJobImage = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobId = req.query.job;
    const imageName = req.file.filename;
    const jobInfo = await Job.findOneAndUpdate(
      { _id: jobId, company: companyId },
      { $set: { image: imageName } },
      { new: true }
    );
    return res.status(200).json(
      ResponseHelper.successResponse({
        job: ObjectHelper.formatJob(jobInfo),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
exports.getApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobId = req.query.job;
    const job = await Job.findOne({ _id: jobId, company: companyId }).populate({
      path: "applicants",
      populate: { path: "userId", select: "-password" }, // Populate the user data for each applicant
    });
    return res.status(200).json(
      ResponseHelper.successResponse({
        applicants: ObjectHelper.applicantFormat(job.applicants),
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(ResponseHelper.badResponse(err));
  }
};
