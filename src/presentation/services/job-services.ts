// Import necessary modules and dependencies
import { NextFunction, Request, Response } from "express";
import { JobEntity, JobModel, JobMapper } from "@domain/job/entities/job";
import { CreateJobUsecase } from "@domain/job/usecases/create-job";
import { DeleteJobUsecase } from "@domain/job/usecases/delete-job";
import { GetJobByIdUsecase } from "@domain/job/usecases/get-job-by-id";
import { UpdateJobUsecase } from "@domain/job/usecases/update-job";
import { GetAllJobsUsecase } from "@domain/job/usecases/get-all-jobs";
import { GettotalCountUsecase } from "@domain/job/usecases/get-total-counts";
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
  private readonly gettotalCountUsecase: GettotalCountUsecase;

  // Constructor to initialize use case instances
  constructor(
    createJobUsecase: CreateJobUsecase,
    deleteJobUsecase: DeleteJobUsecase,
    getJobByIdUsecase: GetJobByIdUsecase,
    updateJobUsecase: UpdateJobUsecase,
    getAllJobsUsecase: GetAllJobsUsecase,
    gettotalCountUsecase: GettotalCountUsecase
  ) {
    this.createJobUsecase = createJobUsecase;
    this.deleteJobUsecase = deleteJobUsecase;
    this.getJobByIdUsecase = getJobByIdUsecase;
    this.updateJobUsecase = updateJobUsecase;
    this.getAllJobsUsecase = getAllJobsUsecase;
    this.gettotalCountUsecase = gettotalCountUsecase;
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
    let loginId = req.body.loginId;
    loginId = "2"; // For testing purposes, manually set loginId to "2"

    const query: any = {}; // Create an empty query object

    // Assign values to properties of the query object
    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.id = parseInt(loginId, 10);
    query.year = parseInt(req.query.year as string, 10);
    query.month = parseInt(req.query.month as string, 10);

    // Execute the getAllJobs use case and get an Either result
    const jobs: Either<ErrorClass, JobEntity[]> =
      await this.getAllJobsUsecase.execute(query);

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

  // Method to get total job posted count
  async getTotalCount(req: Request, res: Response): Promise<void> {
    let id: string = req.body.loginId;
    let loginId = id || "1"; // For testing purposes, manually set loginId to "2"

    const query: any = {}; // Create an empty query object

    // Assign values to properties of the query object
    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.id = parseInt(loginId, 10);
    query.year = parseInt(req.query.year as string, 10);
    query.month = parseInt(req.query.month as string, 10);

    const count: Either<ErrorClass, number> =
      await this.gettotalCountUsecase.execute(query);
    count.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: number) => {
        return res.json({ count: result });
      }
    );
  }
}
