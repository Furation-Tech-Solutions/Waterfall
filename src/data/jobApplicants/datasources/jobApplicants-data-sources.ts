// Import necessary modules and dependencies
import { Op, Sequelize, Model } from "sequelize";
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Import the JobModel
import JobApplicant, {
  applicationStatusEnum,
} from "@data/jobApplicants/models/jobApplicants-models";
import Job from "@data/job/models/job-model";
import Realtors from "@data/realtors/model/realtor-model";
import ApiError from "@presentation/error-handling/api-error";

// Create JobApplicantDataSource Interface
export interface JobApplicantDataSource {
  // Method to create a new job applicant
  create(jobApplicant: any): Promise<JobApplicantEntity>;

  // Method to update an existing job applicant by ID
  update(id: string, updatedData: any): Promise<JobApplicantEntity>;

  // Method to read a job applicant by ID
  read(id: string): Promise<JobApplicantEntity | null>;

  // Method to get all job applicants
  getAll(query: JobApplicantQuery): Promise<JobApplicantEntity[]>;

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
  async create(jobApplicant: any): Promise<JobApplicantEntity> {
    try {
      // Retrieve the associated Job based on jobApplicant's job ID
      const job: any = await Job.findByPk(jobApplicant.jobId);

      // Check if the number of applicants exceeds the limit
      const numberOfApplicantsLimit = job.getDataValue("numberOfApplicants");

      // Count the number of existing applicants with "Pending" status
      const pendingApplicants = await JobApplicant.count({
        where: {
          jobId: jobApplicant.jobId,
          applicantStatus: "Pending",
        },
      });

      // Check if the new applicant can be created based on the status and limit
      if (pendingApplicants < parseInt(numberOfApplicantsLimit)) {
        // Create a new job applicant record in the database
        const createdJobApplicant = await JobApplicant.create(jobApplicant);

        return createdJobApplicant.toJSON();
      } else {
        // Throw an error if the limit is exceeded
        throw new Error("Number of applicants exceeds the limit");
      }
    } catch (error) {
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
          foreignKey: "applicantId",
          as: "applicantIdData",
        },
        {
          model: Job,
          foreignKey: "jobId",
          as: "jobIdData",
        },
      ],
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });

    // If a job applicant record is found, convert it to a plain JavaScript object before returning
    return jobApplicant ? jobApplicant.toJSON() : null;
  }

  // Method to get all job applicants based on query parameters
  async getAll(query: JobApplicantQuery): Promise<JobApplicantEntity[]> {
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
            applicantId: loginId,
          },
          include: [
            {
              model: Job,
              as: "jobIdData",
              foreignKey: "jobId",
            },
            {
              model: Realtors,
              as: "applicantIdData",
              foreignKey: "applicantId",
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
              as: "jobIdData",
              foreignKey: "jobId",
              where: {
                jobOwnerId: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantIdData",
              foreignKey: "applicantId",
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
              as: "jobIdData",
              foreignKey: "jobId",
              where: {
                jobOwnerId: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantIdData",
              foreignKey: "applicantId",
            },
          ],
          limit: itemsPerPage, // Limit the number of results per page
          offset: offset, // Calculate the offset based on the current page
        });

        return jobApplicant.map((jobA: any) => jobA.toJSON());
      }
      //------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "PaymentPending") {
      // Check if the query parameter is "active"
      const jobApplicant = await JobApplicant.findAll({
        where: {
          jobStatus: "JobCompleted", // Filter by applicantStatus
          paymentStatus: false, // Filter by agreement
        },
        include: [
          {
            model: Job,
            as: "jobIdData",
            foreignKey: "jobId",
            where: {
              jobOwnerId: loginId, // Use the correct way to filter by jobOwner
            },
          },
          {
            model: Realtors,
            as: "applicantIdData",
            foreignKey: "applicantId",
          },
        ],
      });
      return jobApplicant.map((jobA: any) => jobA.toJSON());
      //-----------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "Completed") {
      // Check if the query parameter is "active"
      const jobApplicant = await JobApplicant.findAll({
        where: {
          paymentStatus: true, // Filter by agreement
        },
        include: [
          {
            model: Job,
            as: "jobIdData",
            foreignKey: "jobId",
            where: {
              jobOwnerId: loginId, // Use the correct way to filter by jobOwner
            },
          },
          {
            model: Realtors,
            as: "applicantIdData",
            foreignKey: "applicantId",
          },
        ],
      });
      return jobApplicant.map((jobA: any) => jobA.toJSON());
      //-----------------------------------------------------------------------------------------------------------------------------------------
    } else {
      // Retrieve all job applicants with optional pagination
      const jobApplicant = await JobApplicant.findAll({
        include: [
          {
            model: Job,
            as: "jobIdData",
            foreignKey: "jobId",
            where: {
              // jobOwnerId: loginId, // Use the correct way to filter by jobOwner
            },
          },
          {
            model: Realtors,
            as: "applicantIdData",
            foreignKey: "applicantId",
          },
        ],
        limit: itemsPerPage, // Limit the number of results per page
        offset: offset, // Calculate the offset based on the current page
      });
      return jobApplicant.map((jobApplicant: any) => jobApplicant.toJSON());
    }
  }

  // Method to update an existing job applicant by ID
  async update(
    id: string,
    updatedData: JobApplicantModel
  ): Promise<JobApplicantEntity> {
    // Find the job applicant record in the database by ID
    const jobApplicant: any = await JobApplicant.findByPk(id);

    if (!jobApplicant) {
      // Handle the case where the job applicant is not found
      throw new Error("Job Applicant not found");
    }
    //-------------------------------------------------------------------------------------------------------------------------

    // Retrieve the record to check the current applicantStatus
    const existingApplicant: any = await JobApplicant.findByPk(id);

    // Check if the current applicantStatus is different from the updatedData.applicantStatus
    if (existingApplicant.applicantStatus !== updatedData.applicantStatus) {
      // Update the job applicant record with the provided data
      await jobApplicant.update({
        ...updatedData,
        applicantStatusUpdateTime: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
        // .toISOString(), // Set applicantStatusUpdateTime to the current date
      });

      // Fetch the updated job applicant record
      const updatedJobApplicant: Model<any, any> | null =
        await JobApplicant.findByPk(id);

      if (updatedJobApplicant == null) {
        throw ApiError.notFound();
      }
      return updatedJobApplicant.toJSON();
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Retrieve the record to check the current paymentStatus
    const existingPaymentStatus: any = await JobApplicant.findByPk(id);

    // Check if the current paymentStatus is different from the updatedData.paymentStatus
    if (existingPaymentStatus.paymentStatus !== updatedData.paymentStatus) {
      // Update the job applicant record with the provided data
      await jobApplicant.update({
        ...updatedData,
        paymentStatusUpdateTime: new Date().toISOString(), // Set paymentStatusUpdateTime to the current date
      });

      // Fetch the updated job applicant record
      const updatedJobApplicant: Model<any, any> | null =
        await JobApplicant.findByPk(id);

      if (updatedJobApplicant == null) {
        throw ApiError.notFound();
      }
      return updatedJobApplicant.toJSON();
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------------
    // Check if agreement is signed within 24 hours after Accepting
    if (
      jobApplicant.agreement === false &&
      updatedData.agreement === true &&
      jobApplicant.applicantStatus === applicationStatusEnum.ACCEPT
    ) {
      const currentTime = new Date();
      // console.log(currentTime);

      const applicantStatusUpdateTime = jobApplicant.getDataValue(
        "applicantStatusUpdateTime"
      );

      if (
        !applicantStatusUpdateTime ||
        (currentTime.getTime() -
          new Date(applicantStatusUpdateTime).getTime()) /
          (1000 * 60 * 60) >
          24
        // (1000 * 60) > // Change from 24 hours to 5 minutes
        // 2
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
        acceptedApplicant.get("applicantId") !== jobApplicant.get("applicantId")
      ) {
        throw new Error(
          "Job Owner can accept only one application for this Job"
        );
      } else {
        //----------------------------------------------------------------------------------------------
        // Check if the updated values meet the criteria for setting liveStatus to false

        // Update the associated Job to set liveStatus to false
        const associatedJob = await Job.findByPk(
          jobApplicant.getDataValue("jobId")
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
        jobApplicant.getDataValue("jobId")
      );
      if (associatedJob) {
        // Set liveStatus and urgentRequirement to true in the associated Job
        await associatedJob.update({
          liveStatus: true,
          urgentRequirement: true,
        });
      }
    }
    //--------------------------------------------------------------------------------------------------------------------------------------

    // Update the job applicant record with the provided data
    await jobApplicant.update(updatedData);

    // Fetch the updated job applicant record
    const updatedJobApplicant: Model<any, any> | null =
      await JobApplicant.findByPk(id);

    if (updatedJobApplicant == null) {
      throw ApiError.notFound();
    }
    return updatedJobApplicant.toJSON();
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
