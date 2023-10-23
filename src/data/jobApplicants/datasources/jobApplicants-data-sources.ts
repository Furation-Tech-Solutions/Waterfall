// Import necessary modules and dependencies
import { Op, Sequelize } from "sequelize";
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Import the JobModel
import JobApplicant, { applicationStatusEnum, jobStatusEnum } from "@data/jobApplicants/models/jobApplicants-models";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";



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
    const jobApplicant = await JobApplicant.findAll({
      include: [
        {
          model: Job,
          as: "jobdata",
          foreignKey: "job",
        },
        {
          model: Realtors,
          as: "applicantData",
          foreignKey: "applicant",
        },
      ],
    });

    // Convert the records to an array of plain JavaScript objects before returning
    return jobApplicant.map((jobA: any) => jobA.toJSON());
  }

  // // Method to get all job applicants
  // async getAll(applicantId:any): Promise<JobApplicantEntity[]> {
  //   const conditions = {
  //     applicant: applicantId,
  //     agreement: true,
  //     jobStatus: "Pending",
  //   };
  //   const currentDate = new Date();

  //   // Find all job applicant records in the database
  //   const jobApplicant = await JobApplicant.findAll({
  //     attributes: ["*"],
  //     where: { date: { [Op.gte]: currentDate } },
  //     include: [
  //       {
  //         model: JobApplicant,
  //         where: conditions,
  //         required: true, // Inner join to enforce the conditions
  //       },
  //     ],
  //   });

  //   // Check if there are upcoming tasks
  //   if (jobApplicant.length > 0) {
  //     // Convert the records to an array of plain JavaScript objects before returning
  //     return jobApplicant.map((jobApplicant: any) => jobApplicant.toJSON());
  //   } else {
  //     // Return a message or value to indicate that there are no upcoming tasks
  //     return [];
  //   }
  // }

  // // Method to get upcoming tasks for a particular realtor where agreement is true
  // async getUpcomingTasksForRealtor(
  //   applicantId: number
  // ): Promise<JobApplicantEntity[]> {
  //   // Find all job applicant records for the specified realtor where agreement is true
  //   const jobApplicants = await JobApplicant.findAll({
  //     where: {
  //       applicant: applicantId, // This filters by the specified realtor's ID
  //       agreement: true,
  //       jobStatus: {
  //         [Op.in]: [jobStatusEnum.PENDING, applicationStatusEnum.ACCEPT],
  //       },
  //     },
  //   });

  //   // Check if there are upcoming tasks
  //   if (jobApplicants.length > 0) {
  //     // Convert the records to an array of plain JavaScript objects before returning
  //     return jobApplicants.map((jobApplicant: any) => jobApplicant.toJSON());
  //   } else {
  //     // Return a message or value to indicate that there are no upcoming tasks
  //     return [];
  //   }
  // }

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
