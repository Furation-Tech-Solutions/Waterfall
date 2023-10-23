// Import necessary modules and dependencies
import { NextFunction, Request, Response } from "express";
import { JobEntity, JobModel, JobMapper } from "@domain/job/entities/job";
import { CreateJobUsecase } from "@domain/job/usecases/create-job";
import { DeleteJobUsecase } from "@domain/job/usecases/delete-job";
import { GetJobByIdUsecase } from "@domain/job/usecases/get-job-by-id";
import { UpdateJobUsecase } from "@domain/job/usecases/update-job";
import { GetAllJobsUsecase } from "@domain/job/usecases/get-all-jobs";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Create a class for the JobService
export class JobService {
  // Define private properties to hold use case instances
  private readonly createJobUsecase: CreateJobUsecase;
  private readonly deleteJobUsecase: DeleteJobUsecase;
  private readonly getJobByIdUsecase: GetJobByIdUsecase;
  private readonly updateJobUsecase: UpdateJobUsecase;
  private readonly getAllJobsUsecase: GetAllJobsUsecase;

  // Constructor to initialize use case instances
  constructor(
    createJobUsecase: CreateJobUsecase,
    deleteJobUsecase: DeleteJobUsecase,
    getJobByIdUsecase: GetJobByIdUsecase,
    updateJobUsecase: UpdateJobUsecase,
    getAllJobsUsecase: GetAllJobsUsecase
  ) {
    this.createJobUsecase = createJobUsecase;
    this.deleteJobUsecase = deleteJobUsecase;
    this.getJobByIdUsecase = getJobByIdUsecase;
    this.updateJobUsecase = updateJobUsecase;
    this.getAllJobsUsecase = getAllJobsUsecase;
  }

  // Method to create a new job
  async createJob(req: Request, res: Response): Promise<void> {
    // Extract job data from the request body and map it to a JobModel
    const jobData: JobModel = JobMapper.toModel(req.body);

    // Execute the createJob use case and get an Either result
    const newJob: Either<ErrorClass, JobEntity> =
      await this.createJobUsecase.execute(jobData);

    // Handle the result using Either's cata function
    newJob.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, map the result to an Entity and send it as a JSON response
      (result: JobEntity) => {
        const resData = JobMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Method to delete a job by ID
  async deleteJob(req: Request, res: Response): Promise<void> {
    // Extract the job ID from the request parameters
    const jobId: string = req.params.id;

    // Execute the deleteJob use case and get an Either result
    const response: Either<ErrorClass, void> =
      await this.deleteJobUsecase.execute(jobId);

    // Handle the result using Either's cata function
    response.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, send a success message as a JSON response
      () => {
        return res.json({ message: "Job deleted successfully." });
      }
    );
  }

  // Method to get a job by ID
  async getJobById(req: Request, res: Response): Promise<void> {
    // Extract the job ID from the request parameters
    const jobId: string = req.params.id;

    // Execute the getJobById use case and get an Either result
    const job: Either<ErrorClass, JobEntity> =
      await this.getJobByIdUsecase.execute(jobId);

    // Handle the result using Either's cata function
    job.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, map the result to an Entity and send it as a JSON response
      (result: JobEntity) => {
        const resData = JobMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Method to update a job by ID
  async updateJob(req: Request, res: Response): Promise<void> {
    // Extract the job ID from the request parameters and job data from the body
    const jobId: string = req.params.id;
    const jobData: JobModel = req.body;

    // Execute the getJobById use case to retrieve the existing job
    const existingJob: Either<ErrorClass, JobEntity> =
      await this.getJobByIdUsecase.execute(jobId);

    // Handle the result using Either's cata function
    existingJob.cata(
      // If there's an error, send an error response
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      // If successful, map the result to an Entity and proceed to update
      async (result: JobEntity) => {
        const resData = JobMapper.toEntity(result, true);

        // Map the updated data to an Entity
        const updatedJobEntity: JobEntity = JobMapper.toEntity(
          jobData,
          true,
          resData
        );

        // Execute the updateJob use case and get an Either result
        const updatedJob: Either<ErrorClass, JobEntity> =
          await this.updateJobUsecase.execute(jobId, updatedJobEntity);

        // Handle the result using Either's cata function
        updatedJob.cata(
          // If there's an error, send an error response
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          // If successful, map the result to a Model and send it as a JSON response
          (response: JobEntity) => {
            const responseData = JobMapper.toModel(response);
            res.json(responseData);
          }
        );
      }
    );
  }

  // Method to get all jobs
  async getAllJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllJobs use case and get an Either result
    const jobs: Either<ErrorClass, JobEntity[]> =
      await this.getAllJobsUsecase.execute();

    // Handle the result using Either's cata function
    jobs.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, map the results to Entities and send them as a JSON response
      (jobs: JobEntity[]) => {
        const resData = jobs.map((job: any) => JobMapper.toEntity(job));
        return res.json(resData);
      }
    );
  }
}

  // // Method to get all jobs
  // async getAllJobs(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {

  //   // Execute the getAllJobs use case and get an Either result
  //   const jobs: Either<ErrorClass, JobEntity[]> =
  //     await this.getAllJobsUsecase.execute();
  //     emailConfig()
  //   // Handle the result using Either's cata function
  //   jobs.cata(
  //     // If there's an error, send an error response
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     // If successful, map the results to Entities and send them as a JSON response
  //     (jobs: JobEntity[]) => {
  //       const resData = jobs.map((job: any) => JobMapper.toEntity(job));
  //       return res.json(resData);
  //     }
  //   );
  // }
