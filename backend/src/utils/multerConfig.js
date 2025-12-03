const multer = require('multer');
const path = require('path');

// Check if Cloudinary is configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

// Debug logging
if (useCloudinary) {
  console.log('🔵 Cloudinary configured:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'missing'
  });
} else {
  console.log('⚠️  Cloudinary not configured - check .env file for CLOUDINARY_* variables');
}

let storage;

if (useCloudinary) {
  // Use Cloudinary storage (recommended for production)
  console.log('✅ Using Cloudinary for file uploads');
  storage = require('./cloudinaryStorage');
} else {
  console.log('⚠️  Cloudinary not configured, using local storage');
  // Fallback to local storage if Cloudinary not configured
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, '../../uploads/resumes');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const hrId = req.user?.id || req.body?.hrId || 'general';
      
      const organizedDir = path.join(uploadsDir, String(year), month, String(hrId));
      
      if (!fs.existsSync(organizedDir)) {
        fs.mkdirSync(organizedDir, { recursive: true });
      }
      
      cb(null, organizedDir);
    },
    filename: (req, file, cb) => {
      const jobId = req.body?.jobId ? `job-${req.body.jobId}_` : '';
      const timestamp = Date.now();
      const randomSuffix = Math.round(Math.random() * 1E6);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 50);
      
      cb(null, `${jobId}${timestamp}_${randomSuffix}_${name}${ext}`);
    }
  });
}

// File filter - accept only PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPEG, JPG, PNG files are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;

