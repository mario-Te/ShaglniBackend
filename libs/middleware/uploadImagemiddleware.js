const multer = require("multer");

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname; // Generate a unique file name
    cb(null, fileName); // Save the file with the generated file name
  },
});

// Create multer instance with the defined storage
const upload = multer({ storage: storage });

// Middleware function to handle file upload
module.exports = upload.single("image");
