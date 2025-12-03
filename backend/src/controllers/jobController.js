const Job = require('../models/Job');
const Application = require('../models/Application');

class JobController {
  // HR: Create a new job
  async createJob(req, res, next) {
    try {
      const { title, description, salary, location } = req.body;
      const postedBy = req.user.id; // HR user ID from token

      if (!title || !description || !salary || !location) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, salary, and location are required'
        });
      }

      const job = await Job.create({
        title,
        description,
        salary,
        location,
        postedBy
      });

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      next(error);
    }
  }

  // HR: Mark job as expired
  async expireJob(req, res, next) {
    try {
      const { id } = req.params;
      const hrId = req.user.id;

      // Verify job exists and belongs to this HR
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (job.posted_by !== hrId) {
        return res.status(403).json({
          success: false,
          message: 'You can only expire your own jobs'
        });
      }

      const updatedJob = await Job.updateExpiryStatus(id, 'expired');

      // Emit socket event for real-time update (if Socket.io is available)
      if (req.io) {
        req.io.emit('job-expired', {
          jobId: id,
          jobTitle: updatedJob.title,
          message: `Job "${updatedJob.title}" has been marked as expired`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Job marked as expired',
        data: updatedJob
      });
    } catch (error) {
      next(error);
    }
  }

  // User: Get all jobs (active and expired)
  async getActiveJobs(req, res, next) {
    try {
      // Get userId from token if authenticated (optional - route doesn't require auth)
      const userId = req.user?.id || null;
      // Get all jobs (both active and expired)
      const jobs = await Job.findAll(userId);

      // Format the response to include hasApplied flag
      const formattedJobs = jobs.map(job => ({
        ...job,
        hasApplied: job.has_applied === 1 || job.has_applied === true,
        applicationStatus: job.application_status || null
      }));

      // Separate active and expired jobs for better organization
      const activeJobs = formattedJobs.filter(job => job.expiry_status === 'active');
      const expiredJobs = formattedJobs.filter(job => job.expiry_status === 'expired');

      res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: formattedJobs,
        count: formattedJobs.length,
        activeCount: activeJobs.length,
        expiredCount: expiredJobs.length
      });
    } catch (error) {
      next(error);
    }
  }

  // HR: Get all jobs posted by HR
  async getHRJobs(req, res, next) {
    try {
      const hrId = req.user.id;
      const jobs = await Job.findByHR(hrId);

      res.status(200).json({
        success: true,
        message: 'Jobs retrieved successfully',
        data: jobs,
        count: jobs.length
      });
    } catch (error) {
      next(error);
    }
  }

  // User: Apply for a job
  async applyForJob(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Verify job exists and is active
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (job.expiry_status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Cannot apply to an expired job'
        });
      }

      // Check if user already applied before attempting to create
      const existingApplications = await Application.findByUser(userId);
      const hasAlreadyApplied = existingApplications.some(app => app.job_id === parseInt(id));
      
      if (hasAlreadyApplied) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this job',
          hasApplied: true
        });
      }

      const application = await Application.create({
        jobId: id,
        userId,
        status: 'pending'
      });

      // Emit socket event to notify HR (if Socket.io is available)
      if (req.io) {
        req.io.emit('new-application', {
          applicationId: application.id,
          jobId: id,
          jobTitle: job.title,
          userId: userId,
          message: `New application received for job: ${job.title}`
        });
      }

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: application,
        hasApplied: true
      });
    } catch (error) {
      if (error.message === 'User has already applied for this job') {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this job',
          hasApplied: true
        });
      }
      next(error);
    }
  }
}

module.exports = new JobController();

