// Import necessary dependencies and modules
import { JobEntity, JobModel } from "@domain/job/entities/job"; // Import the JobEntity and JobModel from the specified location
import { Either } from "monet"; // Import the Either type from the "monet" library
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the specified location

// Define the interface for the JobRepository
export interface JobRepository {
  // Define a method to create a new job and return an Either monad containing either an ErrorClass or a JobEntity
  createJob(job: JobModel): Promise<Either<ErrorClass, JobEntity>>;

  // Define a method to delete a job by its ID and return an Either monad with a void result or an ErrorClass
  deleteJob(id: string): Promise<Either<ErrorClass, void>>;

  // Define a method to update a job by its ID and new data, returning an Either monad with either an ErrorClass or a JobEntity
  updateJob(id: string, data: JobModel): Promise<Either<ErrorClass, JobEntity>>;

  // Define a method to retrieve a list of jobs and return an Either monad with either an ErrorClass or an array of JobEntities
  getJobs(): Promise<Either<ErrorClass, JobEntity[]>>;

  // Define a method to retrieve a job by its ID and return an Either monad with either an ErrorClass or a JobEntity
  getJobById(id: string): Promise<Either<ErrorClass, JobEntity>>;
}
