// Import necessary modules and dependencies
import { Op, Sequelize, Model } from "sequelize";
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Import the JobModel
import JobApplicant, {
  jobStatusEnum,
} from "@data/jobApplicants/models/jobApplicants-models";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";

// Create JobApplicantDataSource Interface
export interface JobApplicantDataSource {
  // Method to create a new job applicant
  create(jobApplicant: JobApplicantModel): Promise<any>;

  // Method to update an existing job applicant by ID
  update(id: string, updatedData: JobApplicantModel): Promise<any>;

  // Method to read a job applicant by ID
  read(id: string): Promise<JobApplicantEntity | null>;

  // Method to get all job applicants
  getAll(query: JobApplicantQuery): Promise<any[]>;

  // Method to delete a jobApplicant record by ID
  delete(id: string): Promise<void>;
}

// Define a JobApplicantQuery object to encapsulate parameters
export interface JobApplicantQuery {
  id: string;
  q: string;
  page: number;
  limit: number;
}

// jobApplicant Data Source communicates with the database
export class JobApplicantDataSourceImpl implements JobApplicantDataSource {
  constructor(private db: Sequelize) {}

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
        },
      ],
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });

    // If a job applicant record is found, convert it to a plain JavaScript object before returning
    return jobApplicant ? jobApplicant.toJSON() : null;
  }

  // Method to get all job applicants based on query parameters
  async getAll(query: JobApplicantQuery): Promise<any[]> {
    //-------------------------------------------------------------------------------------------------------------
    // Extract relevant information from the query parameters
    let loginId = query.id;
    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page

    const offset = (currentPage - 1) * itemsPerPage;
    //-------------------------------------------------------------------------------------------------------------------------------

    if (query.q === "upcomingTask") {
      {
        // Retrieve upcoming tasks for the specified realtor
        const jobApplicant = await JobApplicant.findAll({
          where: {
            agreement: true, // Now, it's a boolean
            jobStatus: "Pending",
            applicant: loginId,
          },
          include: [
            {
              model: Job,
              as: "jobData",
              foreignKey: "job",
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicant",
            },
          ],
          limit: itemsPerPage, // Limit the number of results per page
          offset: offset, // Calculate the offset based on the current page
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }
    //------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "jobAssigned") {
      {
        // Retrieve job applicants for assigned jobs
        const jobApplicant = await JobApplicant.findAll({
          where: {
            agreement: true, // Now, it's a boolean
            jobStatus: "Pending",
          },
          include: [
            {
              model: Job,
              as: "jobData",
              foreignKey: "job",
              where: {
                jobOwner: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicant",
            },
          ],
          limit: itemsPerPage, // Limit the number of results per page
          offset: offset, // Calculate the offset based on the current page
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }
    //------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "jobResponse") {
      {
        // Retrieve job applicants with pending responses
        const jobApplicant = await JobApplicant.findAll({
          where: {
            applicantStatus: "Pending",
          },
          include: [
            {
              model: Job,
              as: "jobData",
              foreignKey: "job",
              where: {
                jobOwner: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicant",
            },
          ],
          limit: itemsPerPage, // Limit the number of results per page
          offset: offset, // Calculate the offset based on the current page
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }
    } else {
      // Retrieve all job applicants with optional pagination
      const jobApplicant = await JobApplicant.findAll({
        include: [
          {
            model: Job,
            as: "jobData",
            foreignKey: "job",
          },
          {
            model: Realtors,
            as: "applicantData",
            foreignKey: "applicant",
          },
        ],
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      return jobApplicant.map((jobApplicant: any) => jobApplicant.toJSON());
    }
  }

  // Method to update an existing job applicant by ID
  async update(id: string, updatedData: JobApplicantModel): Promise<any> {
    // Find the job applicant record in the database by ID
    const jobApplicant: any = await JobApplicant.findByPk(id);

    if (!jobApplicant) {
      // Handle the case where the job applicant is not found
      throw new Error("Job Applicant not found");
    }

    //-----------------------------------------------------------------------------------------------------------
    // Check if agreement is signed within 24 hours
    if (jobApplicant.agreement === false && updatedData.agreement === true) {
      const currentTime = new Date();
      const applicantStatusUpdateTime = jobApplicant.getDataValue(
        "applicantStatusUpdateTime"
      );

      if (
        !applicantStatusUpdateTime || // If no update time is set
        (currentTime.getTime() -
          new Date(applicantStatusUpdateTime).getTime()) /
          (1000 * 60) >
          5
      ) {
        throw new Error(
          "Agreement can only be set within 24 hours after Accepting"
        );
      }
    }

    //-----------------------------------------------------------------------------------------------------------------------------------

    if (
      jobApplicant.applicantStatus === "Pending" &&
      updatedData.applicantStatus === "Accept"
    ) {
      // Check if there's already an accepted applicant for the same job (jobOwner can accept only one application)
      const acceptedApplicant: Model<any, any> | null = await Job.findOne({
        where: {
          liveStatus: false,
        },
      });

      if (
        acceptedApplicant &&
        acceptedApplicant.get("applicant") !== jobApplicant.get("applicant")
      ) {
        throw new Error(
          "Job Owner can accept only one application for this Job"
        );
      } else {
    //----------------------------------------------------------------------------------------------
        // Check if the updated values meet the criteria for setting liveStatus to false

        // Update the associated Job to set liveStatus to false
        const associatedJob = await Job.findByPk(
          jobApplicant.getDataValue("job")
        );
        if (associatedJob) {
          // Set liveStatus to false in the associated Job
          await associatedJob.update({
            liveStatus: false,
          });
        }
      }
    }

    //--------------------------------------------------------------------------------------------------------------
    // Check if the provided data includes changes to agreement and jobStatus
    if (
      jobApplicant.jobStatus === "Pending" &&
      updatedData.jobStatus === "Decline"
    ) {
      // Update the associated Job to set liveStatus and urgentRequirement to true
      const associatedJob = await Job.findByPk(
        jobApplicant.getDataValue("job")
      );
      if (associatedJob) {
        // Set liveStatus and urgentRequirement to true in the associated Job
        await associatedJob.update({
          liveStatus: true,
          urgentRequirement: true,
        });
      }
    }

    //-------------------------------------------------------------------------------------------------------------

    // Check if the provided data includes changes to jobStatus
    if (
      jobApplicant.jobStatus !== updatedData.jobStatus &&
      updatedData.jobStatus === "JobCompleted"
    ) {
      // Check if the current time is within 24 hours after toTime
      const currentTime: any = new Date();
      const toTime: any = new Date(jobApplicant.getDataValue("toTime"));
      const hoursDifference = Math.abs(currentTime - toTime) / 36e5;

      if (hoursDifference > 24) {
        throw new Error(
          "Job can only be marked as completed within 24 hours after toTime"
        );
      }
    }

    //--------------------------------------------------------------------------------------------------------------------------------------

    // Update the job applicant record with the provided data
    await jobApplicant.update(updatedData);

    // Fetch the updated job applicant record
    const updatedJobApplicant: Model<any, any> | null =
      await JobApplicant.findByPk(id);

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
