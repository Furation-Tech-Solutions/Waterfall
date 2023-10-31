// Import the Sequelize library for working with databases
import { Op, Sequelize } from "sequelize";

// Import the JobEntity and JobModel from the job module
import { JobEntity, JobModel } from "@domain/job/entities/job";

// Import the Job model from the relative path
import Job from "..//models/job-model";
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
}

// Define a JobQuery object to encapsulate parameters
export interface JobQuery {
  id: string;
  q: string;
  page: number;
  limit: number;
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
      include: [
        {
          model: JobApplicant, // Include the JobApplicant model
          as: "applicants", // Use the alias you defined in the association
        },
      ],
      where: {
        id: id,
      },
    });

    // If a job record is found, convert it to a plain JavaScript object and return it, otherwise return null
    return job ? job.toJSON() : null;
  }


  // Method to retrieve all job records with pagination
  async getAll(query: JobQuery): Promise<JobEntity[]> {
    let loginId = parseInt(query.id);
    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page

    const offset = (currentPage - 1) * itemsPerPage;

    if (query.q === "expired") {
      const currentDate = new Date(); // Current date
      currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

      const jobs = await Job.findAll({
        include: [
          {
            model: Realtors,
            as: "owner",
            foreignKey: "jobOwner",
          },
          {
            model: JobApplicant,
            where: {
              agreement: true,
              applicant: loginId,
            },
          },
        ],
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });

      return jobs.map((job: any) => job.toJSON());
    } else {
      // Handle other cases or provide default logic
      const jobs = await Job.findAll({
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

      return jobs.map((job: any) => job.toJSON());
    }
  }

  // // Method to retrieve all job records
  // async getAll(): Promise<JobEntity[]> {
  //   // Find all job records
  //   const jobs = await Job.findAll({
  //     include: [
  //       {
  //         model: Realtors,
  //         as: "owner",
  //         foreignKey: "jobOwner",
  //       },
  //     ],
  //   });

  //   // return data.map((blocking: any) => blocking.toJSON());
  //   // Convert all job records to plain JavaScript objects and return them in an array
  //   return jobs.map((job: any) => job.toJSON());
  // }

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
}
