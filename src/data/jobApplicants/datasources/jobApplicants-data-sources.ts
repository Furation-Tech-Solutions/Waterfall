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
import Report from "@data/report/models/report-model";
import Blocking from "@data/blocking/model/blocking-model";
import Realtors from "@data/realtors/model/realtor-model";
import ApiError from "@presentation/error-handling/api-error";
import { JobApplicantsResponse } from "types/jobApplicant/responseType";

// Create JobApplicantDataSource Interface
export interface JobApplicantDataSource {
  // Method to create a new job applicant
  create(jobApplicant: any, loginId: string): Promise<JobApplicantEntity>;

  // Method to update an existing job applicant by ID
  update(id: string, updatedData: any): Promise<JobApplicantEntity>;

  // Method to read a job applicant by ID
  read(id: string): Promise<JobApplicantEntity | null>;

  // Method to get all job applicants
  getAll(query: JobApplicantQuery): Promise<JobApplicantsResponse>;

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
  constructor(private db: Sequelize) { }

  // Method to create a new job applicant
  async create(jobApplicant: any, loginId: string): Promise<JobApplicantEntity> {
    try {
      // Check if the applicant has already applied for the same job
      const existingApplication = await JobApplicant.findOne({
        where: {
          jobId: jobApplicant.jobId,
          applicantId: jobApplicant.applicantId,
        },
      });

      // Update the record with the provided data if it exists
      if (existingApplication) {
        throw ApiError.applicantExist();
      }
      // Check if the applicant has been reported
      const existingReport = await Report.findOne({
        where: {
          toRealtorId: jobApplicant.applicantId,
        },
      });

      if (existingReport) {
        throw new Error("The applicant can't apply for a job they've been reported");
      }

      // Check if the job owner has blocked the applicant
      const job = await Job.findByPk(jobApplicant.jobId);

      if (!job) {
        // Handle the case where the job is not found
        throw new Error("Job not found");
      }
      const jobOwnerID = job.getDataValue("jobOwnerId");

      // Check if the job owner ID is the same as req.user ID
      if (jobOwnerID === loginId) {
        throw new Error("Job owner cannot apply for their own job");
      }

      const blockingRecord = await Blocking.findOne({
        where: {
          fromRealtorId: jobOwnerID,
          toRealtorId: jobApplicant.applicantId,
        },
      });

      if (blockingRecord) {
        throw new Error("User can't apply for this job as they've been blocked from JobOwner");
      }

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

        // console.log(createdJobApplicant.dataValues, "createdJobApplicant");
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
          as: "applicantData",
        },
        {
          model: Job,
          foreignKey: "jobId",
          as: "jobData",
        },
      ],
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });

    // If a job applicant record is found, convert it to a plain JavaScript object before returning
    return jobApplicant ? jobApplicant.toJSON() : null;
  }

  // Method to get all job applicants based on query parameters
  async getAll(query: JobApplicantQuery): Promise<JobApplicantsResponse> {
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
        // const jobApplicant = await JobApplicant.findAll({
        //   where: {
        //     agreement: true, // Now, it's a boolean
        //     jobStatus: "Pending",
        //     applicantId: loginId,
        //   },
        //   include: [
        //     {
        //       model: Job,
        //       as: "jobData",
        //       foreignKey: "jobId",
        //     },
        //     {
        //       model: Realtors,
        //       as: "applicantData",
        //       foreignKey: "applicantId",
        //     },
        //   ],
        //   limit: itemsPerPage, // Limit the number of results per page
        //   offset: offset, // Calculate the offset based on the current page
        // });

        const { rows: jobApplicant, count: total } =
          await JobApplicant.findAndCountAll({
            where: {
              agreement: true, // Now, it's a boolean
              jobStatus: "Pending",
              applicantId: loginId,
            },
            include: [
              {
                model: Job,
                as: "jobData",
                foreignKey: "jobId",
              },
              {
                model: Realtors,
                as: "applicantData",
                foreignKey: "applicantId",
              },
            ],
            limit: itemsPerPage, // Limit the number of results per page
            offset: offset, // Calculate the offset based on the current page
          });

        const mappedJobApplicants = jobApplicant.map((jobA) => jobA.toJSON());

        return {
          jobApplicants: mappedJobApplicants,
          totalCount: total,
        };
      }
      //------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "jobAssigned") {
      {
        // Retrieve job applicants for assigned jobs
        const { rows: jobApplicant, count: total } =
          await JobApplicant.findAndCountAll({
            where: {
              agreement: true, // Now, it's a boolean
              jobStatus: "Pending",
            },
            include: [
              {
                model: Job,
                as: "jobData",
                foreignKey: "jobId",
                where: {
                  jobOwnerId: loginId, // Use the correct way to filter by jobOwner
                },
              },
              {
                model: Realtors,
                as: "applicantData",
                foreignKey: "applicantId",
              },
            ],
            limit: itemsPerPage, // Limit the number of results per page
            offset: offset, // Calculate the offset based on the current page
          });

        const mappedJobApplicants = jobApplicant.map((jobA) => jobA.toJSON());

        return {
          jobApplicants: mappedJobApplicants,
          totalCount: total,
        };
      }
      //------------------------------------------------------------------------------------------------------------------------------
    } else if (query.q === "jobResponse") {
      {
        // Retrieve job applicants with pending responses
        const { rows: jobApplicant, count: total } =
          await JobApplicant.findAndCountAll({
            where: {
              applicantStatus: "Pending",
            },
            include: [
              {
                model: Job,
                as: "jobData",
                foreignKey: "jobId",
                where: {
                  jobOwnerId: loginId, // Use the correct way to filter by jobOwner
                },
              },
              {
                model: Realtors,
                as: "applicantData",
                foreignKey: "applicantId",
              },
            ],
            limit: itemsPerPage, // Limit the number of results per page
            offset: offset, // Calculate the offset based on the current page
          });

        const mappedJobApplicants = jobApplicant.map((jobA) => jobA.toJSON());

        return {
          jobApplicants: mappedJobApplicants,
          totalCount: total,
        };
      }
      //------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "PaymentPending") {
      // Check if the query parameter is "active"
      const { rows: jobApplicant, count: total } =
        await JobApplicant.findAndCountAll({
          where: {
            jobStatus: "JobCompleted", // Filter by applicantStatus
            paymentStatus: false, // Filter by agreement
          },
          include: [
            {
              model: Job,
              as: "jobData",
              foreignKey: "jobId",
              where: {
                jobOwnerId: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicantId",
            },
          ],
        });
      const mappedJobApplicants = jobApplicant.map((jobA) => jobA.toJSON());

      return {
        jobApplicants: mappedJobApplicants,
        totalCount: total,
      };
      //-----------------------------------------------------------------------------------------------------------------------
    } else if (query.q == "Completed") {
      // Check if the query parameter is "active"
      const { rows: jobApplicant, count: total } =
        await JobApplicant.findAndCountAll({
          where: {
            paymentStatus: true, // Filter by agreement
          },
          include: [
            {
              model: Job,
              as: "jobData",
              foreignKey: "jobId",
              where: {
                jobOwnerId: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicantId",
            },
          ],
        });
      const mappedJobApplicants = jobApplicant.map((jobA) => jobA.toJSON());

      return {
        jobApplicants: mappedJobApplicants,
        totalCount: total,
      };
      //-----------------------------------------------------------------------------------------------------------------------------------------
    } else {
      // Retrieve all job applicants with optional pagination
      const { rows: jobApplicant, count: total } =
        await JobApplicant.findAndCountAll({
          include: [
            {
              model: Job,
              as: "jobData",
              foreignKey: "jobId",
              where: {
                // jobOwnerId: loginId, // Use the correct way to filter by jobOwner
              },
            },
            {
              model: Realtors,
              as: "applicantData",
              foreignKey: "applicantId",
            },
          ],
          limit: itemsPerPage, // Limit the number of results per page
          offset: offset, // Calculate the offset based on the current page
        });
      const mappedJobApplicants = jobApplicant.map((jobA) => jobA.toJSON());

      return {
        jobApplicants: mappedJobApplicants,
        totalCount: total,
      };
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
    // Retrieve the associated Job to set jobProgress based on liveStatus
    const associatedJob = await Job.findByPk(
      jobApplicant.getDataValue("jobId")
    );

    if (associatedJob) {
      // If jobStatus: "JobCompleted", paymentStatus: false in JobApplicant, set jobProgress to "PaymentPending"
      if (
        updatedData.jobStatus === "JobCompleted" &&
        updatedData.paymentStatus === false
      ) {
        await associatedJob.update({
          jobProgress: "paymentPending",
        });
      }

      // If paymentStatus: true in JobApplicant, set jobProgress to "Completed"
      else if (updatedData.paymentStatus === true) {
        await associatedJob.update({
          jobProgress: "completed",
        });
      }
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

      // Check if the updated paymentStatus is true and if the milestone is reached
      if (updatedData.paymentStatus) {
        const jobCount = await JobApplicant.count({
          where: {
            applicantId: jobApplicant.applicantId,
            paymentStatus: true,
          },
        });

        // Check if the jobCount is a multiple of 5
        if (jobCount % 5 === 0) {
          // Find the associated Realtor record
          const realtor: any = await Realtors.findByPk(
            jobApplicant.applicantId
          );

          if (realtor) {
            // Calculate the milestone badge name
            const milestoneBadgeName = `${jobCount}+ Successful Projects`;

            // Check if the milestone badge already exists in the badges array
            const existingBadgeIndex = realtor.badge.findIndex(
              (badge: string | { badgeName: string; timestamp: string }) =>
                typeof badge === "string" && badge === milestoneBadgeName
            );

            if (existingBadgeIndex === -1) {
              // Add the milestone badge as an object to the badges array
              await realtor.update({
                badge: [
                  ...realtor.badge,
                  {
                    badgeName: milestoneBadgeName,
                    timestamp: new Date().toISOString(),
                  },
                ],
              });
            }
          }
        }
      }

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
        (1000 * 60 * 60) > 2
      ) {
        throw new Error(
          "Agreement can only be set within 2 hours after Accepting"
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
      const associatedJob = await Job.findByPk<any>(
        jobApplicant.getDataValue("jobId")
      );
      if (associatedJob) {
        // Set liveStatus to true in the associated Job
        await associatedJob.update({
          liveStatus: true,
        });

        const currentDate = new Date();


        const lastDate: Date | string | null | undefined = associatedJob.applyBy;


        if (
          lastDate &&
          new Date(lastDate).toDateString() === currentDate.toDateString()
        ) {
          const fromTime = new Date(associatedJob.fromTime);

          const currentTime = new Date();

          // Calculate 10 hours before fromTime of the day
          const tenHoursBeforeFromTime = new Date(
            fromTime.getFullYear(),
            fromTime.getMonth(),
            fromTime.getDate(),
            fromTime.getHours() - 10,
            fromTime.getMinutes(),
            0
          );


          if (currentTime >= tenHoursBeforeFromTime) {
            // console.log(currentTime >= tenHoursBeforeFromTime, "currentTime >= tenHoursBeforeFromTime")
            await associatedJob.update({
              urgentRequirement: true,
            });
          }
        }
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
