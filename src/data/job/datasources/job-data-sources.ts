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
  getAll(id: string, q: string): Promise<JobEntity[]>;
}

// Implementation of the JobDataSource interface
export class JobDataSourceImpl implements JobDataSource {
  // Constructor that accepts a Sequelize database connection
  constructor(private db: Sequelize) { }

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
    });

    // If a job record is found, convert it to a plain JavaScript object and return it, otherwise return null
    return job ? job.toJSON() : null;
  }

  // Method to retrieve all job records with expired dates and jobApplicants.agreement = true
  async getAll(id: string, q: string): Promise<JobEntity[]> {
    let loginId = parseInt(id);
    console.log("data source ", id, q);
    if (q === "expired") {
      const currentDate = new Date(); // Current date
      currentDate.setHours(0, 0, 0, 0); // Set the time to midnight
      console.log(currentDate);

      const jobs = await Job.findAll({
      });



      return jobs.map((job: any) => job.toJSON());
    } else {
      // Handle other cases or provide a default logic
      const jobs = await Job.findAll({
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
}
