const cloudinary = require('../../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
    // Organize files in Cloudinary by folder structure
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const hrId = req.user?.id || req.body?.hrId || 'general';
    const jobId = req.body?.jobId ? `job-${req.body.jobId}` : 'general';
    
    // Folder structure: resumes/YYYY/MM/HR_ID/job_ID/
    const folder = `resumes/${year}/${month}/${hrId}/${jobId}`;
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E6);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    
    const publicId = `${folder}/${timestamp}_${randomSuffix}_${name}`;
    
    // Determine resource type based on file extension
    const resourceType = ext.toLowerCase() === '.pdf' ? 'raw' : 
                        ['.doc', '.docx'].includes(ext.toLowerCase()) ? 'raw' : 
                        'image'; // For JPEG, JPG, PNG
    
    return {
      folder: folder,
      public_id: publicId,
      resource_type: resourceType,
      allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      // For raw files (PDF, DOC), we don't need transformation
      // For images, we can add transformations if needed
      ...(resourceType === 'image' ? {
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      } : {})
    };
    } catch (error) {
      console.error('❌ Error in CloudinaryStorage params:', error);
      throw error;
    }
  }
});

module.exports = storage;

