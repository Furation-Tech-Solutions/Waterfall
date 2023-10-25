// Import statements for required modules and classes
import { JobEntity, JobModel } from "@domain/job/entities/job";
import { NotInterestedRepository } from "@domain/notInterested/repositories/notInterested-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import {
  NotInterestedModel,
  NotInterestedEntity,
} from "@domain/notInterested/entities/notInterested_entities";

// Define an interface for the 'UpdateNotInterested' use case
export interface UpdateNotInterestedUsecase {
  // Define the 'execute' method with two parameters:
  // 1. 'notInterestedId' (a string representing the ID of the saved job to update)
  // 2. 'notInterestedData' (a 'NotInterestedModel' containing the updated data)
  // The method returns a Promise that resolves to either an 'ErrorClass' or a 'NotInterestedEntity'
  execute: (
    notInterestedId: string,
    notInterestedData: NotInterestedModel
  ) => Promise<Either<ErrorClass, NotInterestedEntity>>;
}

// Define the 'UpdateNotInterested' class which implements the 'UpdateNotInterestedUsecase' interface
export class UpdateNotInterested implements UpdateNotInterestedUsecase {
  // Private property to hold a reference to the 'NotInterestedRepository'
  private readonly notInterestedRepository: NotInterestedRepository;

  // Constructor to initialize the 'notInterestedRepository' property
  constructor(notInterestedRepository: NotInterestedRepository) {
    this.notInterestedRepository = notInterestedRepository;
  }

  // Implementation of the 'execute' method
  async execute(
    notInterestedId: string,
    notInterestedData: NotInterestedModel
  ): Promise<Either<ErrorClass, NotInterestedEntity>> {
    // Call the 'updateNotInterested' method of the 'notInterestedRepository' to update the saved job
    return await this.notInterestedRepository.updateNotInterested(
      notInterestedId,
      notInterestedData
    );
  }
}