const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Define the upload directory
const uploadDir = path.join(__dirname, '../../public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Upload directory created:", uploadDir);
}

// Configure Multer Storage (memory storage for processing with Sharp)
const storage = multer.memoryStorage(); // Store files in memory

// File Filter: Allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept image files
  } else {
    console.error(`File rejected: ${file.originalname} (Invalid Type: ${file.mimetype})`);
    cb(new Error('Only image files are allowed!'), false); // Reject non-image files
  }
};

// Initialize Multer with memory storage and file filter
const upload = multer({
  storage,
  fileFilter
});

// Middleware for processing images using Sharp
const processImage = async (req, res, next) => {
  if (!req.file) return next(); // Skip if no file uploaded

  const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}.webp`; // Convert to WebP
  const outputPath = path.join(uploadDir, fileName);

  try {
    // Resize and Convert Image
    await sharp(req.file.buffer)
      .resize(800) // Resize width to 800px, keep aspect ratio
      .toFormat('webp') // Convert to WebP format
      .toFile(outputPath);

    req.file.filename = fileName; // Save new filename for response
    req.file.path = `/uploads/${fileName}`; // Save public path

    next();
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).json({ error: 'Image processing failed' });
  }
};

module.exports = { upload, processImage };
