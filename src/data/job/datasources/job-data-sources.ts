// Import necessary modules and dependencies
import { Op, Sequelize, where } from "sequelize";
import { JobEntity, JobModel } from "@domain/job/entities/job";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import ApiError from "@presentation/error-handling/api-error";

// Create an interface JobDataSource to define the contract for interacting with job data
export interface JobDataSource {
  // Method to create a new job record
  create(job: any): Promise<JobEntity>;

  // Method to update an existing job record by ID
  update(id: string, job: any): Promise<JobEntity>;

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
  months?: Array<number>;
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
    // Check if there are JobApplicants with agreement=true for the given job
    const hasApplicants = await JobApplicant.findOne({
      where: {
        job: id,
        agreement: true,
      },
    });

    // If there are applicants with agreement=true, prevent deletion
    if (hasApplicants) {
      throw new Error("Cannot delete job with applicants");
    }

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

      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
          date: {
            [Op.lt]: currentDate, // Filter jobs where the date is in the past
          },
        };
      } else {
        whereCondition = {
          date: {
            [Op.lt]: currentDate, // Filter jobs where the date is in the past
          },
        };
      }

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
        where: whereCondition,
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });

      return jobs.map((job: any) => job.toJSON());

      //-----------------------------------------------------------------------------------------------------------
    } else if (query.q === "jobsForYou") {
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
      // console.log("completedJobTypes:", completedJobTypes);

      // Recommend jobs with the same jobType
      const recommendedJobs = await Job.findAll({
        where: {
          jobType: completedJobTypes, // Filter by the extracted jobTypes
          liveStatus: true,
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
      // console.log("reccommendedJobs:", recommendedJobs);

      // console.log("recommendedJobs:", recommendedJobs);

      return recommendedJobs.map((job: any) => job.toJSON());

      //-----------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "jobCompleted") {
      // Fetch jobs that are marked as 'JobCompleted' and meet certain criteria

      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      }

      const jobs = await Job.findAll({
        where: whereCondition,
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

      return jobs.map((job: any) => job.toJSON());

      //-----------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "appliedJobs") {
      // Find jobs where the applicant ID matches the provided ID
      const appliedJobs = await Job.findAll({
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

      return appliedJobs.map((job: any) => job.toJSON());

      //----------------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "active") {
      // Check if the query parameter is "active"
      const jobs = await Job.findAll({
        where: {
          date: {
            [Op.gt]: new Date(),
          },
          liveStatus: true,
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

      //------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "all") {
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      }

      // Handle other cases or provide default logic
      const jobs = await Job.findAll({
        where: whereCondition,
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
        order: [
          // Then, sort by date in ascending order
          ["date", "ASC"],
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return jobs.map((job: any) => job.toJSON());
    } else {
      // Handle other cases or provide default logic
      const jobs = await Job.findAll({
        where: {
          jobOwner: loginId,
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
        order: [
          // Then, sort by date in ascending order
          ["date", "ASC"],
        ],
        limit: itemsPerPage,
        offset: offset,
      });

      return jobs.map((job: any) => job.toJSON());
    }
  }

  // Method to update a job record by ID
  async update(id: string, updatedData: JobModel): Promise<JobEntity> {
    // Find the job record by its ID
    const job = await Job.findByPk(id);

    // If the job record is found, update it with the provided data
    if (job) {
      await job.update(updatedData);
    }

    // Fetch the updated job record
    const updatedJob = await Job.findByPk(id);

    if (updatedJob == null) {
      throw ApiError.notFound();
    }
    return updatedJob.toJSON();
  }

  // Method to retrieve the total number of posted jobs
  async counts(query: JobQuery): Promise<number> {
    let loginId = query.id;

    const currentPage = query.page || 1; // Default to page 1

    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;

    //-------------------------------------------------------------------------------------------------------------------------------------

    if (query.q === "posted") {
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          jobOwner: loginId,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      } else {
        whereCondition = {
          jobOwner: loginId,
        };
      }

      const count = await Job.count({
        where: whereCondition,
      });
      return count;
    } else if (query.q === "accepted") {
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          jobOwner: loginId,
          liveStatus: false,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      } else {
        whereCondition = {
          jobOwner: loginId,
          liveStatus: false,
        };
      }

      const count = await Job.count({
        where: whereCondition,
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
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          jobOwner: loginId,
          liveStatus: false,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      } else {
        whereCondition = {
          jobOwner: loginId,
          liveStatus: false,
        };
      }

      const count = await Job.count({
        where: whereCondition,
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
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          jobOwner: loginId,
          liveStatus: false,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      } else {
        whereCondition = {
          jobOwner: loginId,
          liveStatus: false,
        };
      }

      const count = await Job.count({
        where: whereCondition,
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
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      }

      const count = await Job.count({
        where: whereCondition,
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
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          liveStatus: false,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      } else {
        whereCondition = {
          liveStatus: false,
        };
      }

      const count = await Job.count({
        where: whereCondition,
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
      let whereCondition = {};

      if (query.year && query.months && query.months.length > 0) {
        // If year and months are provided, filter by year and months
        whereCondition = {
          liveStatus: false,
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM date")),
              query.year
            ),
            {
              [Op.or]: query.months.map((month) => {
                return Sequelize.where(
                  Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM date")),
                  month
                );
              }),
            },
          ],
        };
      } else {
        whereCondition = {
          liveStatus: false,
        };
      }

      const count = await Job.count({
        where: whereCondition,
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
