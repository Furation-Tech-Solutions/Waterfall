// Import necessary modules and dependencies
import { Op, Sequelize } from "sequelize";
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Import the JobModel
import JobApplicant, { jobStatusEnum } from "@data/jobApplicants/models/jobApplicants-models";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";
// import { JobStatusEnum } from "types/jobApplicant/upcomingTaskInterface";
import { Query } from "types/jobApplicant/upcomingTaskInterface";

// Create JobApplicantDataSource Interface
export interface JobApplicantDataSource {
  // Method to create a new job applicant
  create(jobApplicant: JobApplicantModel): Promise<any>;

  // Method to update an existing job applicant by ID
  update(id: string, jobApplicant: JobApplicantModel): Promise<any>;

  // Method to read a job applicant by ID
  read(id: string): Promise<JobApplicantEntity | null>;

  // Method to get all job applicants
  getAll(id: string, q: string): Promise<any[]>;

  // Method to delete a jobApplicant record by ID
  delete(id: string): Promise<void>;
}

// jobApplicant Data Source communicates with the database
export class JobApplicantDataSourceImpl implements JobApplicantDataSource {
  constructor(private db: Sequelize) { }

  // Method to create a new job applicant
  async create(jobApplicant: any): Promise<any> {
    try {
      // Create a new job applicant record in the database
      const createdJobApplicant = await JobApplicant.create(jobApplicant);

      // Retrieve the associated Job based on jobApplicant's job ID
      const job: any = await Job.findByPk(jobApplicant.job);

      return createdJobApplicant.toJSON();
    } catch (error) {
      // Handle any potential errors, e.g., validation errors or database issues
      throw error;
    }
  }


  // Method to read a job applicant by ID
  async read(id: string): Promise<JobApplicantEntity | null> {
    // Find a job applicant record in the database by ID
    const jobApplicant = await JobApplicant.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          foreignKey: "applicant",
          as: "applicantData",
        },
        {
          model: Job,
          foreignKey: "job",
          as: "jobData",
        }
      ]
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });

    // If a job applicant record is found, convert it to a plain JavaScript object before returning
    return jobApplicant ? jobApplicant.toJSON() : null;
  }

  async getAll(id: string, q: string): Promise<any[]> {
    let loginId = parseInt(id);


    if (q === "upcomingTask") {
      {

        const jobApplicant = await JobApplicant.findAll({
          where: {
            agreement: true, // Now, it's a boolean
            jobStatus: "Pending",
            applicant: loginId,
          },
          include: [
            {
              model: Realtors,
              foreignKey: "applicant",
              as: "applicantData",
            },
            {
              model: Job,
              foreignKey: "job",
              as: "jobData",
            }
          ]
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }

    } else if (q === "jobAssigned") {
      {

        const jobApplicant = await JobApplicant.findAll({
          where: {
            agreement: true, // Now, it's a boolean
            jobStatus: "Pending",
          },
          include: [
            {
              model: Realtors,
              foreignKey: "applicant",
              as: "applicantData",
            },
            {
              model: Job,
              foreignKey: "job",
              as: "jobData",
            }
          ]
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }

    } else if (q === "jobResponse") {
      {
        const jobApplicant = await JobApplicant.findAll({
          where: {
            applicantStatus: "Pending",
          },
          include: [
            {
              model: Realtors,
              foreignKey: "applicant",
              as: "applicantData",
            },
            {
              model: Job,
              foreignKey: "job",
              as: "jobData",
            }
          ]
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }
    } else {
      const jobApplicant = await JobApplicant.findAll({
        include: [
          {
            model: Realtors,
            foreignKey: "applicant",
            as: "applicantData",
          },
          {
            model: Job,
            foreignKey: "job",
            as: "jobData",
          }
        ]
      });
      return jobApplicant.map((jobApplicant: any) => jobApplicant.toJSON());
    }

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
