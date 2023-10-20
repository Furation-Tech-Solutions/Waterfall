// Import necessary modules and dependencies
import { NextFunction, Request, Response } from "express";
import {
  JobApplicantEntity,
  JobApplicantModel,
  JobApplicantMapper,
} from "@domain/jobApplicants/entites/jobApplicants";
import { GetJobApplicantByIdUsecase } from "@domain/jobApplicants/usecases/get-jobApplicant-by-id";
import { UpdateJobApplicantUsecase } from "@domain/jobApplicants/usecases/update-jobApplicant";
import { GetAllJobApplicantsUsecase } from "@domain/jobApplicants/usecases/get-all-jobApplicants";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import { CreateJobApplicantUsecase } from "@domain/jobApplicants/usecases/create-jobApplicants";
import { DeleteJobApplicantUsecase } from "@domain/jobApplicants/usecases/delete-jobApplicant";
import Realtors from "@data/realtors/model/realtor-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import Jobs from "@data/job/models/job-model";

// Create a class called JobApplicantService
export class JobApplicantService {
  // Declare private properties to store use cases
  private readonly createJobApplicantUsecase: CreateJobApplicantUsecase;
  private readonly getJobApplicantByIdUsecase: GetJobApplicantByIdUsecase;
  private readonly getAllJobApplicantsUsecase: GetAllJobApplicantsUsecase;
  private readonly updateJobApplicantUsecase: UpdateJobApplicantUsecase;
  private readonly deleteJobApplicantUsecase: DeleteJobApplicantUsecase;

  // Constructor to initialize use cases
  constructor(
    createJobApplicantUsecase: CreateJobApplicantUsecase,
    getJobApplicantByIdUsecase: GetJobApplicantByIdUsecase,
    getAllJobApplicantsUsecase: GetAllJobApplicantsUsecase,
    updateJobApplicantUsecase: UpdateJobApplicantUsecase,
    deleteJobApplicantUsecase: DeleteJobApplicantUsecase
  ) {
    this.createJobApplicantUsecase = createJobApplicantUsecase;
    this.getJobApplicantByIdUsecase = getJobApplicantByIdUsecase;
    this.getAllJobApplicantsUsecase = getAllJobApplicantsUsecase;
    this.updateJobApplicantUsecase = updateJobApplicantUsecase;
    this.deleteJobApplicantUsecase = deleteJobApplicantUsecase;
  }

  // Method to create a new job applicant
  async createJobApplicant(req: Request, res: Response): Promise<void> {
    // Extract job applicant data from the request body and convert it to a model
    const jobApplicantData: JobApplicantModel = JobApplicantMapper.toModel(
      req.body
    );

    // Execute the create job applicant use case and handle the result using Either
    const newJobApplicant: Either<ErrorClass, JobApplicantEntity> =
      await this.createJobApplicantUsecase.execute(jobApplicantData);

    // Handle the result using cata function
    newJobApplicant.cata(
      (
        error: ErrorClass // Handle error case
      ) => res.status(error.status).json({ error: error.message }),
      (result: JobApplicantEntity) => {
        // Handle success case
        const resData = JobApplicantMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Method to get a job applicant by ID
  async getJobApplicantById(req: Request, res: Response): Promise<void> {
    // Extract the job applicant ID from the request parameters
    const jobId: string = req.params.id;

    // Execute the get job applicant by ID use case and handle the result using Either
    const job: Either<ErrorClass, JobApplicantEntity> =
      await this.getJobApplicantByIdUsecase.execute(jobId);

    // Handle the result using cata function
    job.cata(
      (
        error: ErrorClass // Handle error case
      ) => res.status(error.status).json({ error: error.message }),
      (result: JobApplicantEntity) => {
        // Handle success case
        const resData = JobApplicantMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

 
  async getAllJobApplicants(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Extract the filter parameters from the request query
    const filterJobOwner = req.body.jobOwner as string;
    const filterJobStatus = req.query.jobStatus as string;
    const filterPaymentStatus = req.query.paymentStatus as string;
      const loggedInUserId = req.body.loggedInUserId as string;
    const filterAgreement = req.query.agreement as string;

    // const populate = await Jobs.findAll({
    //   where: {
    //     jobOwner: filterJobOwner,
    //   },
    // });

    // console.log("======>", populate);

    // Execute the get all job applicants use case and handle the result using Either
    const jobs: Either<ErrorClass, JobApplicantEntity[]> =
      await this.getAllJobApplicantsUsecase.execute();

    // Handle the result using cata function
    jobs.cata(
      (
        error: ErrorClass // Handle error case
      ) => res.status(error.status).json({ error: error.message }),
      (jobApplicants: JobApplicantEntity[]): any => {
        // Handle success case
        let responseData = jobApplicants.map((jobApplicant: any) =>
          JobApplicantMapper.toEntity(jobApplicant)
        );

        // Apply the jobOwner filter
        if (filterJobOwner) {
          responseData = responseData.filter(
            (jobApplicant: JobApplicantEntity) => {
              return jobApplicant.job.toString() === filterJobOwner;
            }
          );
        }

        // Apply the jobStatus filter
        if (filterJobStatus) {
          responseData = responseData.filter(
            (jobApplicant: JobApplicantEntity) => {
              return jobApplicant.jobStatus === filterJobStatus;
            }
          );
        }

        // Apply the PaymentStatus filter
        if (filterPaymentStatus) {
          responseData = responseData.filter(
            (jobApplicant: JobApplicantEntity) => {
              if (filterPaymentStatus === "true") {
                // Return true if jobStatus is "Completed" (payment is true)
                return jobApplicant.jobStatus === "Completed";
              } else {
                // Return true for other jobStatus values (payment is false)
                return jobApplicant.jobStatus !== "Completed";
              }
            }
          );
        }

        // Apply the filter for upcoming tasks where agreement is true and jobStatus is Pending
        if (filterAgreement) {
          if (filterAgreement === "true") {
            responseData = responseData.filter(
              (jobApplicant: JobApplicantEntity) => {
                return jobApplicant.agreement === true;
              }
            );
          } else if (filterAgreement === "false") {
            responseData = responseData.filter(
              (jobApplicant: JobApplicantEntity) => {
                return jobApplicant.agreement === false;
              }
            );
          }
        }

        console.log("filterAgreement:", filterAgreement);
        console.log("responseData length:", responseData.length);

        return res.json(responseData);
      }
    );
  }

  // Method to update a job applicant
  async updateJobApplicant(req: Request, res: Response): Promise<void> {
    // Extract the job applicant ID from the request parameters
    const jobApplicantId: string = req.params.id;
    // Extract job applicant data from the request body
    const jobApplicantData: JobApplicantModel = req.body;

    // Execute the get job applicant by ID use case and handle the result using Either
    const existingJobApplicant: Either<ErrorClass, JobApplicantEntity> =
      await this.getJobApplicantByIdUsecase.execute(jobApplicantId);

    // Handle the result using cata function
    existingJobApplicant.cata(
      (error: ErrorClass) => {
        // Handle error case
        res.status(error.status).json({ error: error.message });
      },
      async (result: JobApplicantEntity) => {
        // Handle success case
        const resData = JobApplicantMapper.toEntity(result, true);

        // Convert the updated job applicant data to an entity
        const updatedJobApplicantEntity: JobApplicantEntity =
          JobApplicantMapper.toEntity(jobApplicantData, true, resData);

        // Execute the update job applicant use case and handle the result using Either
        const updatedJobApplicant: Either<ErrorClass, JobApplicantEntity> =
          await this.updateJobApplicantUsecase.execute(
            jobApplicantId,
            updatedJobApplicantEntity
          );

        // Handle the result using cata function
        updatedJobApplicant.cata(
          (error: ErrorClass) => {
            // Handle error case
            res.status(error.status).json({ error: error.message });
          },
          (response: JobApplicantEntity) => {
            // Handle success case
            const responseData = JobApplicantMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  // Method to delete a jobApplicant by ID
  async deleteJobApplicant(req: Request, res: Response): Promise<void> {
    // Extract the jobApplicant ID from the request parameters
    const jobApplicantId: string = req.params.id;

    // Execute the deleteJobApplicant use case and get an Either result
    const response: Either<ErrorClass, void> =
      await this.deleteJobApplicantUsecase.execute(jobApplicantId);

    // Handle the result using Either's cata function
    response.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, send a success message as a JSON response
      () => {
        return res.json({ message: "JobApplicant deleted successfully." });
      }
    );
  }
}
