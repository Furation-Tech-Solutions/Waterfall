// Importing the JobApplicantRepository interface from a module called "@domain/jobApplicant/repositories/jobApplicant-repository"
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository";

// Importing the ErrorClass from a module called "@presentation/error-handling/api-error"
import { ErrorClass } from "@presentation/error-handling/api-error";

// Importing the Either type from a module called "monet"
import { Either } from "monet";

// Defining an interface called DeleteJobApplicantUsecase
export interface DeleteJobApplicantUsecase {
  // Declaring a method called 'execute' which takes a 'jobApplicantId' (a string) as a parameter
  // The method returns a Promise that resolves to an Either type, which can contain an ErrorClass or void (indicating success)
  execute: (jobApplicantId: string) => Promise<Either<ErrorClass, void>>;
}

// Implementing the DeleteJobApplicant class which implements the DeleteJobApplicantUsecase interface
export class DeleteJobApplicant implements DeleteJobApplicantUsecase {
  // Declaring a private readonly property called 'jobApplicantRepository' of type JobApplicantRepository
  private readonly jobApplicantRepository: JobApplicantRepository;

  // Constructor for the DeleteJobApplicant class which takes a 'jobApplicantRepository' parameter of type JobApplicantRepository
  constructor(jobApplicantRepository: JobApplicantRepository) {
    // Assigning the 'jobApplicantRepository' parameter to the class property 'jobApplicantRepository'
    this.jobApplicantRepository = jobApplicantRepository;
  }

  // Implementing the 'execute' method defined in the DeleteJobApplicantUsecase interface
  async execute(jobApplicantId: string): Promise<Either<ErrorClass, void>> {
    // Calling the 'deleteJobApplicant' method on the 'jobApplicantRepository' and passing the 'jobApplicantId'
    // This method is expected to return a Promise that resolves to an Either type
    // The Either type can contain an ErrorClass (if there's an error) or void (if the deletion is successful)
    return await this.jobApplicantRepository.deleteJobApplicant(jobApplicantId);
  }
}
