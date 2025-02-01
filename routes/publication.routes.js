const express = require('express');
const router = express.Router();
const postController = require('../controllers/publication.controller');
const { upload, processImage } = require('../models/Middleware/upload'); // Fix import

// Routes for publication-related operations
router.get('/getposts', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/toggleLike', postController.toggleLike);
router.post('/:postId/addComment', postController.addComment);

// Route for creating a post with a single image
router.post(
  '/create',
  upload.single('imagePublication'),
  processImage, // Process image with Sharp
  postController.createPost
);

// Route for creating a post with multiple images
router.post(
  '/createPost',
  upload.fields([
    { name: 'imagePublication', maxCount: 1 },
    { name: 'imagesArray', maxCount: 5 }
  ]),
  async (req, res, next) => {
    try {
      console.log('Uploaded Files:', req.files); // Debugging

      // Process multiple images with Sharp
      if (req.files['imagesArray']) {
        req.files['imagesArray'] = await Promise.all(
          req.files['imagesArray'].map(async (file) => {
            const processedPath = await processImageFile(file);
            return { ...file, path: processedPath };
          })
        );
      }

      // Process single main image
      if (req.files['imagePublication']) {
        req.files['imagePublication'][0].path = await processImageFile(
          req.files['imagePublication'][0]
        );
      }

      next();
    } catch (err) {
      console.error('Error processing images:', err);
      res.status(500).json({ error: 'Image processing failed' });
    }
  },
  postController.createPost
);

// Function to process images with Sharp
const processImageFile = async (file) => {
  const sharp = require('sharp');
  const path = require('path');
  const fs = require('fs');

  const uploadDir = path.join(__dirname, '../../public/uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}.webp`;
  const outputPath = path.join(uploadDir, fileName);

  await sharp(file.buffer)
    .resize(800) // Resize width to 800px
    .toFormat('webp') // Convert to WebP
    .toFile(outputPath);

  return `/uploads/${fileName}`;
};

module.exports = router;
