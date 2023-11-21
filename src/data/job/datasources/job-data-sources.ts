// Import necessary modules and dependencies
import { Op, Sequelize, where } from "sequelize";
import { JobEntity, JobModel } from "@domain/job/entities/job";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";

// Create an interface JobDataSource to define the contract for interacting with job data
export interface JobDataSource {
  // Method to create a new job record
  create(job: JobModel): Promise<JobEntity>;

  // Method to update an existing job record by ID
  update(id: string, job: JobModel): Promise<any>;

  // Method to delete a job record by ID
  delete(id: string): Promise<void>;

  // Method to read a job record by ID
  read(id: string): Promise<JobEntity | null>;

  // Method to retrieve all job records
  getAll(query: JobQuery): Promise<JobEntity[]>;

  // Method to retrieve a total job posted count
  counts(query: JobQuery): Promise<number>;
}

// Define a JobQuery object to encapsulate parameters
export interface JobQuery {
  id: number;
  q: string;
  page: number;
  limit: number;
  year?: number;
  month?: number;
}

// Implementation of the JobDataSource interface
export class JobDataSourceImpl implements JobDataSource {
  // Constructor that accepts a Sequelize database connection
  constructor(private db: Sequelize) {}

  // Method to create a new job record
  async create(job: any): Promise<JobEntity> {
    // Create a new job record using the provided data
    const createdJob = await Job.create(job);

    // Return the created job as a plain JavaScript object
    return createdJob.toJSON();
  }

  // Method to delete a job record by ID
  async delete(id: string): Promise<void> {
    // Delete the job record where the ID matches the provided ID
    await Job.destroy({
      where: {
        id: id,
      },
    });
  }

  // Method to read a job record by ID
  async read(id: string): Promise<JobEntity | null> {
    // Find a job record where the ID matches the provided ID
    const job = await Job.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          as: "owner",
          foreignKey: "jobOwner",
        },
        {
          model: JobApplicant,
          as: "applicantsData",
        },
      ],
    });

    // If a job record is found, convert it to a plain JavaScript object and return it, otherwise return null
    return job ? job.toJSON() : null;
  }

  // Method to retrieve a list of job records
  async getAll(query: JobQuery): Promise<JobEntity[]> {
    //---------------------------------------------------------------------------------------------------------
    let loginId = query.id;

    const currentPage = query.page || 1; // Default to page 1

    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;

    //------------------------------------------------------------------------------------------------------------
    // Check the query parameter 'q' for different filters
    if (query.q === "expired") {
      const currentDate = new Date(); // Current date
      currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

      // Fetch jobs that are expired
      const jobs = await Job.findAll({
        include: [
          {
            model: Realtors,
            as: "owner",
            foreignKey: "jobOwner",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              agreement: true,
              jobStatus: "Pending",
              applicant: loginId,
            },
          },
        ],
        where: {
          date: {
            [Op.lt]: currentDate, // Filter jobs where the date is in the past
          },
        },
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });

      return jobs.map((job: any) => job.toJSON());

      //-----------------------------------------------------------------------------------------------------------
    } else if (query.q === "jobCompleted") {
      // Fetch jobs that are marked as 'JobCompleted' and meet certain criteria
      const jobs = await Job.findAll({
        include: [
          {
            model: Realtors,
            as: "owner",
            foreignKey: "jobOwner",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              jobStatus: "JobCompleted",
              agreement: true,
              paymentStatus: true,
              applicant: loginId,
            },
          },
        ],
      });
      // Extract jobTypes from jobs
      const completedJobTypes = jobs.map((job: any) => job.jobType);
      //-----------------------------------------------------------------------------------------------------------------------------------------

      // Recommend jobs with the same jobType
      const recommendedJobs = await Job.findAll({
        where: {
          jobType: completedJobTypes, // Filter by the extracted jobTypes
        },
        include: [
          {
            model: Realtors,
            as: "owner",
            foreignKey: "jobOwner",
          },
        ],
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      // console.log("recommendedJobs:", recommendedJobs);

      return recommendedJobs.map((job: any) => job.toJSON());

      //-----------------------------------------------------------------------------------------------------------------------
    } else if (query.year && query.month) {
      // Fetch jobs that match the specified year and month
      const jobs = await Job.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
              query.month
            ),
          ],
        },
        include: [
          {
            model: Realtors,
            as: "owner",
            foreignKey: "jobOwner",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicant: loginId,
            },
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });
      return jobs.map((job: any) => job.toJSON());
    } else {
      // Handle other cases or provide default logic
      const jobs = await Job.findAll({
        where: {
          // jobOwner: loginId,
        },
        include: [
          {
            model: Realtors,
            as: "owner",
            foreignKey: "jobOwner",
          },
          {
            model: JobApplicant,
            as: "applicantsData",
          },
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return jobs.map((job: any) => job.toJSON());
    }
  }

  // Method to update a job record by ID
  async update(id: string, updatedData: JobModel): Promise<any> {
    // Find the job record by its ID
    const job = await Job.findByPk(id);

    // If the job record is found, update it with the provided data
    if (job) {
      await job.update(updatedData);
    }

    // Fetch the updated job record
    const updatedJob = await Job.findByPk(id);

    // If the updated job record is found, convert it to a plain JavaScript object and return it, otherwise return null
    return updatedJob ? updatedJob.toJSON() : null;
  }

  // Method to retrieve the total number of posted jobs
  async counts(query: JobQuery): Promise<number> {
    let loginId = query.id;

    const currentPage = query.page || 1; // Default to page 1

    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;

    //-------------------------------------------------------------------------------------------------------------------------------------

    if (query.q === "posted") {
      const count = await Job.count({
        where: {
          jobOwner: loginId,
        },
      });
      return count;
    } else if (query.q === "accepted") {
      const count = await Job.count({
        where: {
          jobOwner: loginId,
          liveStatus: false,
        },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              applicantStatus: "Accept",
            },
          },
        ],
      });
      return count;
      //----------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "completedjobsforowner") {
      const count = await Job.count({
        where: {
          jobOwner: loginId,
          liveStatus: false,
        },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              paymentStatus: true,
              jobStatus: "JobCompleted",
            },
          },
        ],
      });
      return count;
      //---------------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "scheduled") {
      const count = await Job.count({
        where: {
          jobOwner: loginId,
          liveStatus: false,
        },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              agreement: true, // Now, it's a boolean
              jobStatus: "Pending",
            },
          },
        ],
      });
      return count;
      //------------------------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "applied") {
      const count = await Job.count({
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              id: loginId,
            },
          },
        ],
      });
      return count;
      //----------------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "assigned") {
      const count = await Job.count({
        where: {
          liveStatus: false,
        },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              id: loginId,
            },
          },
        ],
      });
      return count;
      //----------------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "completedjobforapplicant") {
      const count = await Job.count({
        where: {
          liveStatus: false,
        },
        include: [
          {
            model: JobApplicant,
            as: "applicantsData",
            where: {
              id: loginId,
              jobStatus: "JobCompleted",
            },
          },
        ],
      });
      return count;
    } else {
      return 0;
    }
    //--------------------------------------------------------------------------------------------------------------------
  }
}
