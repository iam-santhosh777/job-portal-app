const Resume = require('../models/Resume');
const path = require('path');

class ResumeController {
  // HR: Upload multiple resumes
  async uploadResumes(req, res, next) {
    try {
      const hrId = req.user.id;
      const { jobId } = req.body; // Optional jobId
      
      console.log('📤 Upload request received');
      console.log('📋 req.files:', req.files ? `${req.files.length} file(s)` : 'no files');
      if (req.files && req.files.length > 0) {
        console.log('📋 File field names:', req.files.map(f => f.fieldname).join(', '));
      }
      console.log('📋 req.body:', Object.keys(req.body));
      
      // Handle both 'resumes' (array) and 'resume' (single) field names
      // When using upload.any(), files are in req.files array with fieldname property
      let files = [];
      if (req.files && Array.isArray(req.files)) {
        // Filter files by field name - accept both 'resume' and 'resumes'
        files = req.files.filter(file => 
          file.fieldname === 'resume' || file.fieldname === 'resumes'
        );
        console.log(`📁 Found ${files.length} file(s) with field names 'resume' or 'resumes'`);
        
        if (files.length === 0 && req.files.length > 0) {
          // If no files found with expected names, show what we got
          const foundFields = req.files.map(f => f.fieldname).join(', ');
          console.log(`⚠️  No files with field name 'resume' or 'resumes'. Found: ${foundFields}`);
          return res.status(400).json({
            success: false,
            message: `Invalid field name. Expected 'resume' or 'resumes', but got: ${foundFields}`,
            receivedFields: req.files.map(f => f.fieldname)
          });
        }
      } else if (req.files && !Array.isArray(req.files)) {
        // Single file object
        if (req.files.fieldname === 'resume' || req.files.fieldname === 'resumes') {
          files = [req.files];
          console.log(`📁 Found 1 file with field name '${req.files.fieldname}'`);
        } else {
          return res.status(400).json({
            success: false,
            message: `Invalid field name. Expected 'resume' or 'resumes', but got: ${req.files.fieldname}`
          });
        }
      }

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedResumes = [];
      const failedResumes = [];

      // Process each file
      for (const file of files) {
        try {
          console.log('📄 Processing file:', file.originalname);
          console.log('📦 File object keys:', Object.keys(file));
          
          // Handle Cloudinary upload - CloudinaryStorage returns URL in different ways
          // Or local storage (file.path will be local file path)
          let filePath;
          let fileUrl;
          
          // Check for Cloudinary URL in various possible properties
          // CloudinaryStorage may return: file.path, file.secure_url, or file.url
          // Sometimes it's in file.path as a full URL
          const cloudinaryUrl = file.secure_url || 
                               file.url || 
                               (file.path && typeof file.path === 'string' && (file.path.startsWith('http://') || file.path.startsWith('https://')) ? file.path : null);
          
          if (cloudinaryUrl) {
            // Cloudinary upload - store the Cloudinary URL
            filePath = cloudinaryUrl;
            fileUrl = cloudinaryUrl;
            console.log('✅ File uploaded to Cloudinary:', filePath);
          } else {
            // Local storage - file.path contains local path
            filePath = file.path || `memory://${Date.now()}-${file.originalname}`;
            fileUrl = null; // Will be generated on request
            console.log('📁 File saved locally:', filePath);
            console.log('⚠️  Cloudinary URL not found in file object. Check Cloudinary configuration.');
          }
          
          const resume = await Resume.create({
            jobId: jobId || null,
            hrId,
            filename: file.originalname,
            filePath: filePath,
            status: 'uploaded'
          });

          const baseUrl = `${req.protocol}://${req.get('host')}`;
          
          uploadedResumes.push({
            id: resume.id,
            filename: resume.filename,
            jobId: resume.job_id,
            filePath: resume.file_path,
            fileUrl: fileUrl || null,
            status: resume.status,
            createdAt: resume.created_at,
            downloadUrl: `${baseUrl}/api/resumes/${resume.id}/download`,
            viewUrl: `${baseUrl}/api/resumes/${resume.id}/url`
          });
        } catch (error) {
          // If DB insert fails, mark file as failed
          failedResumes.push({
            filename: file.originalname,
            error: error.message
          });
        }
      }

      const response = {
        success: true,
        message: `Processed ${files.length} file(s)`,
        data: {
          uploaded: uploadedResumes,
          failed: failedResumes
        }
      };

      // If there are failures, return 207 (Multi-Status) or 200 with failed list
      const statusCode = failedResumes.length > 0 ? 207 : 200;
      
      res.status(statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  // HR: Get all resumes
  async getResumes(req, res, next) {
    try {
      const hrId = req.user.id;
      const resumes = await Resume.findByHR(hrId);
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // Format resumes with download URLs
      const formattedResumes = resumes.map(resume => {
        const resumeData = {
          id: resume.id,
          filename: resume.filename,
          jobId: resume.job_id,
          jobTitle: resume.job_title,
          status: resume.status,
          createdAt: resume.created_at,
          downloadUrl: `${baseUrl}/api/resumes/${resume.id}/download`,
          viewUrl: `${baseUrl}/api/resumes/${resume.id}/url`
        };

        // Add Cloudinary URL if available
        if (resume.file_path && resume.file_path.startsWith('http')) {
          resumeData.cloudinaryUrl = resume.file_path;
          resumeData.filePath = resume.file_path;
        } else {
          resumeData.filePath = resume.file_path;
        }

        return resumeData;
      });

      res.status(200).json({
        success: true,
        message: 'Resumes retrieved successfully',
        data: formattedResumes,
        count: formattedResumes.length
      });
    } catch (error) {
      next(error);
    }
  }

  // HR: Download resume file
  async downloadResume(req, res, next) {
    try {
      const hrId = req.user.id;
      const { id } = req.params;

      const resume = await Resume.findById(id);
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      // Verify HR owns this resume
      if (resume.hr_id !== hrId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only download your own resumes.'
        });
      }

      const filePath = resume.file_path;

      // Check if it's a Cloudinary URL
      if (filePath && filePath.startsWith('http')) {
        // Redirect to Cloudinary download URL with attachment flag
        const downloadUrl = filePath.replace('/upload/', '/upload/fl_attachment/');
        return res.redirect(downloadUrl);
      }

      // Local file storage
      const fs = require('fs');
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'Resume file not found on server'
        });
      }

      // Send file with proper headers
      res.setHeader('Content-Disposition', `attachment; filename="${resume.filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  // HR: Get resume file URL (for viewing in browser)
  async getResumeUrl(req, res, next) {
    try {
      const hrId = req.user.id;
      const { id } = req.params;

      const resume = await Resume.findById(id);
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      // Verify HR owns this resume
      if (resume.hr_id !== hrId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const filePath = resume.file_path;
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // Check if it's a Cloudinary URL
      if (filePath && filePath.startsWith('http')) {
        // Cloudinary URL - can add transformations if needed
        const viewUrl = filePath; // Direct Cloudinary URL
        const downloadUrl = filePath.replace('/upload/', '/upload/fl_attachment/');
        
        return res.status(200).json({
          success: true,
          data: {
            id: resume.id,
            filename: resume.filename,
            url: viewUrl,
            downloadUrl: downloadUrl,
            apiDownloadUrl: `${baseUrl}/api/resumes/${id}/download`
          }
        });
      }

      // Local file storage
      const fileUrl = filePath.replace(/^uploads/, '/uploads');

      res.status(200).json({
        success: true,
        data: {
          id: resume.id,
          filename: resume.filename,
          url: `${baseUrl}${fileUrl}`,
          downloadUrl: `${baseUrl}/api/resumes/${id}/download`
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // HR: Delete resume
  async deleteResume(req, res, next) {
    try {
      console.log('🗑️  Delete resume request received');
      console.log('📋 req.params:', req.params);
      console.log('📋 req.method:', req.method);
      
      const hrId = req.user?.id;
      const { id } = req.params;

      if (!hrId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - User not authenticated'
        });
      }

      console.log(`🔍 Looking for resume ID: ${id} for HR ID: ${hrId}`);
      const resume = await Resume.findById(id);
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      // Verify HR owns this resume
      if (resume.hr_id !== hrId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only delete your own resumes.'
        });
      }

      // Delete from Cloudinary if it's a Cloudinary URL
      if (resume.file_path && (resume.file_path.startsWith('http://') || resume.file_path.startsWith('https://'))) {
        try {
          const cloudinary = require('../../config/cloudinary');
          
          // Extract public_id from Cloudinary URL
          // URL format: https://res.cloudinary.com/cloud_name/resource_type/upload/v1234567/folder/public_id.ext
          // Or: https://res.cloudinary.com/cloud_name/resource_type/upload/folder/public_id.ext
          const url = resume.file_path;
          
          // Check if it's a Cloudinary URL
          if (url.includes('res.cloudinary.com')) {
            const urlParts = url.split('/');
            const uploadIndex = urlParts.findIndex(part => part === 'upload');
            
            if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
              // Get everything after 'upload'
              let pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
              
              // Remove version if present (v1234567/)
              pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
              
              // Remove file extension to get public_id
              const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
              
              // Determine resource type (raw for PDF/DOC, image for JPG/PNG)
              const isRaw = /\.(pdf|doc|docx)$/i.test(resume.filename);
              const resourceType = isRaw ? 'raw' : 'image';
              
              // Delete from Cloudinary
              const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType
              });
              
              if (result.result === 'ok') {
                console.log('✅ Deleted from Cloudinary:', publicId);
              } else {
                console.log('⚠️  Cloudinary deletion result:', result.result);
              }
            }
          }
        } catch (cloudinaryError) {
          console.error('⚠️  Error deleting from Cloudinary (continuing with DB delete):', cloudinaryError.message);
          // Continue with database deletion even if Cloudinary deletion fails
        }
      } else {
        // Delete local file if it exists
        try {
          const fs = require('fs');
          if (fs.existsSync(resume.file_path)) {
            fs.unlinkSync(resume.file_path);
            console.log('✅ Deleted local file:', resume.file_path);
          }
        } catch (fileError) {
          console.error('⚠️  Error deleting local file (continuing with DB delete):', fileError.message);
          // Continue with database deletion even if file deletion fails
        }
      }

      // Delete from database
      const deleted = await Resume.deleteByHR(hrId, id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found or access denied'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Resume deleted successfully',
        data: {
          id: id,
          filename: resume.filename
        }
      });
    } catch (error) {
      console.error('❌ Error deleting resume:', error);
      next(error);
    }
  }
}

module.exports = new ResumeController();

