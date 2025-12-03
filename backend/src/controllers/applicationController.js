const Application = require('../models/Application');
const Job = require('../models/Job');

class ApplicationController {
  // HR: Get all applications for their jobs
  async getHRApplications(req, res, next) {
    try {
      const hrId = req.user.id;
      
      // Get all jobs posted by this HR
      const jobs = await Job.findByHR(hrId);
      const jobIds = jobs.map(job => job.id);
      
      if (jobIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No applications found',
          data: [],
          count: 0
        });
      }

      // Get all applications for these jobs in a single query (optimized)
      const allApplications = await Application.findByJobs(jobIds);

      res.status(200).json({
        success: true,
        message: 'Applications retrieved successfully',
        data: allApplications,
        count: allApplications.length
      });
    } catch (error) {
      next(error);
    }
  }

  // HR: Get applications for a specific job
  async getJobApplications(req, res, next) {
    try {
      const { jobId } = req.params;
      const hrId = req.user.id;

      // Verify job exists and belongs to this HR
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (job.posted_by !== hrId) {
        return res.status(403).json({
          success: false,
          message: 'You can only view applications for your own jobs'
        });
      }

      const applications = await Application.findByJob(jobId);

      res.status(200).json({
        success: true,
        message: 'Applications retrieved successfully',
        data: applications,
        count: applications.length
      });
    } catch (error) {
      next(error);
    }
  }

  // User: Get their own applications
  async getUserApplications(req, res, next) {
    try {
      const userId = req.user.id;
      const applications = await Application.findByUser(userId);

      res.status(200).json({
        success: true,
        message: 'Your applications retrieved successfully',
        data: applications,
        count: applications.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApplicationController();

