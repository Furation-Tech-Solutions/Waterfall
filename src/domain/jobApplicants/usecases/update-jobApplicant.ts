// Import necessary modules and types

import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants";
// Import JobApplicantEntity and JobApplicantModel from the specified module.

import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository";
// Import the JobApplicantRepository from the specified module.

import { ErrorClass } from "@presentation/error-handling/api-error";
// Import the ErrorClass type from the specified module.

import { Either } from "monet";
// Import the Either type from the "monet" library.

// Define an interface for the "UpdateJobApplicant" use case.
export interface UpdateJobApplicantUsecase {
  // Define a method "execute" that takes jobApplicantId (string) and jobApplicantData (JobApplicantModel)
  // as parameters and returns a Promise containing Either<ErrorClass, JobApplicantEntity>.
  execute: (
    jobApplicantId: string,
    jobApplicantData: JobApplicantModel
  ) => Promise<Either<ErrorClass, JobApplicantEntity>>;
}

// Define a class named "UpdateJobApplicant" that implements the "UpdateJobApplicantUsecase" interface.
export class UpdateJobApplicant implements UpdateJobApplicantUsecase {
  private readonly jobApplicantRepository: JobApplicantRepository;

  // Constructor that takes a "jobApplicantRepository" parameter of type "JobApplicantRepository".
  constructor(jobApplicantRepository: JobApplicantRepository) {
    this.jobApplicantRepository = jobApplicantRepository;
  }

  // Implement the "execute" method from the interface.
  async execute(
    jobApplicantId: string,
    jobApplicantData: JobApplicantModel
  ): Promise<Either<ErrorClass, JobApplicantEntity>> {
    // Call the "updateJobApplicant" method on the "jobApplicantRepository" with the provided parameters.
    return await this.jobApplicantRepository.updateJobApplicant(
      jobApplicantId,
      jobApplicantData
    );
  }
}
