const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const specializationController = require("../controllers/specialzationController");
const NotificationController = require("../controllers/NotificationController");
const jobController = require("../controllers/jobsController");
const userController = require("../controllers/userController");
const adminContoller = require("../controllers/AdminController");
const { Variables } = require("../config/constant");
const { verifyToken } = require("../middleware/jwtmiddlware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const uploadImageMiddleware = require("../middleware/uploadImagemiddleware");

// Auth_Routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/register-company", authController.registerCompany);
router.post("/login-company", authController.LoginCompany);
router.post("/login-admin", authController.loginAdmin);
//UserInfo
router.get(
  "/personal-info",
  verifyToken([Variables.Roles.user, Variables.Roles.company]),
  userController.getPersonalData
);

router.get("/company-info", userController.getCompanyData);
router.get("/user-info", userController.getUserData);
router.put(
  "/update-skills",
  verifyToken([Variables.Roles.user]),
  userController.updateSkills
);
router.put(
  "/update-basic-info",
  verifyToken([Variables.Roles.user, Variables.Roles.company]),
  userController.updateBasicInfo
);

router.put(
  "/update-bio",
  verifyToken([Variables.Roles.user]),
  userController.updateBio
);
router.put(
  "/update-education",
  verifyToken([Variables.Roles.user]),
  userController.updateEducation
);
router.put(
  "/update-image",
  verifyToken([Variables.Roles.user, Variables.Roles.company]),
  uploadImageMiddleware,
  userController.updateImage
);

// Specilization
router.get("/get-specializations", specializationController.getSpecilzation);
//jobs
router.get("/get-jobs", jobController.getJobs);

router.get("/guest-company-jobs", jobController.getGuestCompanyJobs);
router.get(
  "/get-company-jobs",
  verifyToken([Variables.Roles.company]),
  jobController.getCompanyJobs
);
router.get("/search-jobs", jobController.searchJob);
router.get("/search-job", jobController.getSingleJob);
router.post(
  "/apply-job",
  verifyToken([Variables.Roles.user]),
  uploadMiddleware,
  jobController.apply
);
router.post(
  "/create-new-job",
  verifyToken([Variables.Roles.company]),
  jobController.create
);
router.get(
  "/get-job-applicants",
  verifyToken([Variables.Roles.company]),
  jobController.getApplicants
);
router.put(
  "/update-job-image",
  verifyToken([Variables.Roles.company]),
  uploadImageMiddleware,
  jobController.UpdateJobImage
);
// Notification
router.get(
  "/get-notifications",
  verifyToken([Variables.Roles.user, Variables.Roles.company]),
  NotificationController.getNotificationUser
);
router.put(
  "/open-notifications",
  verifyToken([Variables.Roles.user, Variables.Roles.company]),
  NotificationController.updateNotificationUser
);
//admin Routes
router.get(
  "/get-users-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getUsersAdmin
);
router.get(
  "/get-user-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getUserAdmin
);

router.get(
  "/get-companies-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getCompanyAdmin
);
router.get(
  "/get-all-companies-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getAllCompaniesAdmin
);

router.get(
  "/get-jobs-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getJobsAdmin
);
router.get(
  "/get-job-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getJobAdmin
);
router.get(
  "/get-company-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getSingleCompanyAdmin
);

router.delete(
  "/delete-company-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.deleteCompany
);
router.delete(
  "/delete-applicant-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.deleteApplicant
);
router.delete(
  "/delete-user-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.deleteUser
);
router.delete(
  "/delete-job-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.deleteJob
);
router.get(
  "/get-applicants-admin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.getApplicantAdmin
);
router.post(
  "/create-user-byadmin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.createUser
);

router.post(
  "/create-company-byadmin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.createCompany
);
router.post(
  "/create-job-byadmin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.createJob
);

router.put(
  "/update-user-byadmin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.UpdateUser
);
router.put(
  "/update-job-byadmin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.UpdateJob
);
router.put(
  "/update-company-byadmin",
  verifyToken([Variables.Roles.admin]),
  adminContoller.UpdateCompany
);

module.exports = router;
