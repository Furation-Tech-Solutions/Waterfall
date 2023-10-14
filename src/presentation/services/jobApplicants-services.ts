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

  // Method to get all job applicants
  async getAllJobApplicants(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the get all job applicants use case and handle the result using Either
    const jobs: Either<ErrorClass, JobApplicantEntity[]> =
      await this.getAllJobApplicantsUsecase.execute();

    // Handle the result using cata function
    jobs.cata(
      (
        error: ErrorClass // Handle error case
      ) => res.status(error.status).json({ error: error.message }),
      (jobApplicants: JobApplicantEntity[]): any => {

        const fiterStatus = req.query.jobStatus as string;

        // Handle success case
        let  responseData = jobApplicants.map((jobApplicant: any) =>
          JobApplicantMapper.toEntity(jobApplicant)
        );
        
        if(fiterStatus){
          console.log("fiterStatus", fiterStatus)
          let  fiteredJob: string[] =  []
          responseData = responseData.filter((jobApplicant: JobApplicantEntity) => {
            if(jobApplicant.jobStatus === fiterStatus) {
                fiteredJob.push(jobApplicant.job)
            }
            
          });
          return res.json(fiteredJob)
        }else {
          return res.json(responseData)
        }
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
