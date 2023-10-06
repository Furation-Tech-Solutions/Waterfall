// Import necessary modules and dependencies
import { Sequelize } from "sequelize";
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Import the JobModel
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";


// Create JobApplicantDataSource Interface
export interface JobApplicantDataSource {
  // Method to create a new job applicant
  create(jobApplicant: JobApplicantModel): Promise<any>;

  // Method to update an existing job applicant by ID
  update(id: string, jobApplicant: JobApplicantModel): Promise<any>;

  // Method to read a job applicant by ID
  read(id: string): Promise<JobApplicantEntity | null>;

  // Method to get all job applicants
  getAll(): Promise<JobApplicantEntity[]>;

  // Method to delete a jobApplicant record by ID
  delete(id: string): Promise<void>;
}

// jobApplicant Data Source communicates with the database
export class JobApplicantDataSourceImpl implements JobApplicantDataSource {
  constructor(private db: Sequelize) {}

  // Method to create a new job applicant
  async create(jobApplicant: any): Promise<any> {
    // Create a new job applicant record in the database
    const createdJobApplicant = await JobApplicant.create(jobApplicant);

    // Convert the created record to a plain JavaScript object and return it
    return createdJobApplicant.toJSON();
  }

  // Method to read a job applicant by ID
  async read(id: string): Promise<JobApplicantEntity | null> {
    // Find a job applicant record in the database by ID
    const jobApplicant = await JobApplicant.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });

    // If a job applicant record is found, convert it to a plain JavaScript object before returning
    return jobApplicant ? jobApplicant.toJSON() : null;
  }

  // Method to get all job applicants
  async getAll(): Promise<JobApplicantEntity[]> {
    // Find all job applicant records in the database
    const jobApplicant = await JobApplicant.findAll({});

    // Convert the records to an array of plain JavaScript objects before returning
    return jobApplicant.map((jobA: any) => jobA.toJSON());
  }

  // Method to update an existing job applicant by ID
  async update(id: string, updatedData: JobApplicantModel): Promise<any> {
    // Find the job applicant record in the database by ID
    const jobApplicant = await JobApplicant.findByPk(id);

    // Update the job applicant record with the provided data if found
    if (jobApplicant) {
      await jobApplicant.update(updatedData);
    }

    // Fetch the updated job applicant record
    const updatedJobApplicant = await JobApplicant.findByPk(id);

    // If an updated job applicant record is found, convert it to a plain JavaScript object before returning
    return updatedJobApplicant ? updatedJobApplicant.toJSON() : null;
  }
  // Method to delete a jobApplicant record by ID
  async delete(id: string): Promise<void> {
    // Delete the jobApplicant record where the ID matches the provided ID
    await JobApplicant.destroy({
      where: {
        id: id,
      },
    });
  }
}
