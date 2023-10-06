// Importing the JobRepository interface from a module called "@domain/job/repositories/job-repository"
import { JobRepository } from "@domain/job/repositories/job-repository";

// Importing the ErrorClass from a module called "@presentation/error-handling/api-error"
import { ErrorClass } from "@presentation/error-handling/api-error";

// Importing the Either type from a module called "monet"
import { Either } from "monet";

// Defining an interface called DeleteJobUsecase
export interface DeleteJobUsecase {
  // Declaring a method called 'execute' which takes a 'jobId' (a string) as a parameter
  // The method returns a Promise that resolves to an Either type, which can contain an ErrorClass or void (indicating success)
  execute: (jobId: string) => Promise<Either<ErrorClass, void>>;
}

// Implementing the DeleteJob class which implements the DeleteJobUsecase interface
export class DeleteJob implements DeleteJobUsecase {
  // Declaring a private readonly property called 'jobRepository' of type JobRepository
  private readonly jobRepository: JobRepository;

  // Constructor for the DeleteJob class which takes a 'jobRepository' parameter of type JobRepository
  constructor(jobRepository: JobRepository) {
    // Assigning the 'jobRepository' parameter to the class property 'jobRepository'
    this.jobRepository = jobRepository;
  }

  // Implementing the 'execute' method defined in the DeleteJobUsecase interface
  async execute(jobId: string): Promise<Either<ErrorClass, void>> {
    // Calling the 'deleteJob' method on the 'jobRepository' and passing the 'jobId'
    // This method is expected to return a Promise that resolves to an Either type
    // The Either type can contain an ErrorClass (if there's an error) or void (if the deletion is successful)
    return await this.jobRepository.deleteJob(jobId);
  }
}
