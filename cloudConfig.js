const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Use Multer memory storage
// This keeps files in RAM (not on disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload image buffer directly to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder = 'Wanderlust_DEV') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'jpeg'],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // 🔥 Send file buffer to Cloudinary
    stream.end(fileBuffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
