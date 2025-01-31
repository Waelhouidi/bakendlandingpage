const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory
const uploadDir = path.join(__dirname, '../../public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Upload directory created:", uploadDir);
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving file to:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')); // Remove spaces from filenames
  }
});

// File Filter: Allow only imagesconst fileFilter = (req, file, cb) => {
  const fileFilter = (req, file, cb) => {
    if (file && file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept image files
    } else {
      console.error(`File rejected: ${file.originalname} (Invalid Type: ${file.mimetype})`);
      cb(new Error('Only image files are allowed!'), false); // Reject non-image files
    }
  };
  


// Initialize Multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
 
});

module.exports = upload;
