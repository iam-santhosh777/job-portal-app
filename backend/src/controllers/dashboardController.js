const Job = require('../models/Job');
const Application = require('../models/Application');
const Resume = require('../models/Resume');

class DashboardController {
  // HR: Get dashboard analytics
  async getDashboard(req, res, next) {
    try {
      const hrId = req.user.id;

      // Get all stats in parallel
      const [jobStats, applicationStats, resumeStats] = await Promise.all([
        Job.getStats(hrId),
        Application.getStatsForHR(hrId),
        Resume.getStatsForHR(hrId)
      ]);

      // Calculate totals - totalJobs includes both active and expired jobs
      const totalJobs = parseInt(jobStats.total_jobs) || 0;
      const totalActiveJobs = parseInt(jobStats.total_active) || 0;
      const totalExpired = parseInt(jobStats.total_expired) || 0;

      const analytics = {
        totalJobs: totalJobs, // Includes both active and expired jobs
        totalActiveJobs: totalActiveJobs,
        totalExpired: totalExpired,
        // Verify: totalJobs should equal totalActiveJobs + totalExpired
        totalApplications: parseInt(applicationStats.total_applications) || 0,
        totalResumesUploaded: parseInt(resumeStats.total_resumes) || 0,
        uploadedResumes: parseInt(resumeStats.uploaded_count) || 0,
        failedResumes: parseInt(resumeStats.failed_count) || 0
      };

      res.status(200).json({
        success: true,
        message: 'Dashboard analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();

