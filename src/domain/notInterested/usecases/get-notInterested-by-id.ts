// Importing the necessary modules and types
import { NotInterestedEntity } from "@domain/notInterested/entities/notInterested_entities";
import { NotInterestedRepository } from "@domain/notInterested/repositories/notInterested-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the GetNotInterestedById use case
export interface GetNotInterestedByIdUsecase {
  // Method signature for executing the use case, taking a notInterestedId parameter
  // and returning a Promise that resolves to Either an ErrorClass or a NotInterestedEntity
  execute: (notInterestedId: string) => Promise<Either<ErrorClass, NotInterestedEntity>>;
}

// Implement the GetNotInterestedById use case
export class GetNotInterestedById implements GetNotInterestedByIdUsecase {
  // Private member to store the NotInterestedRepository instance
  private readonly notInterestedRepository: NotInterestedRepository;

  // Constructor to initialize the NotInterestedRepository instance
  constructor(notInterestedRepository: NotInterestedRepository) {
    this.notInterestedRepository = notInterestedRepository;
  }

  // Implementation of the execute method from the interface
  async execute(
    notInterestedId: string
  ): Promise<Either<ErrorClass, NotInterestedEntity>> {
    // Call the getNotInterestedById method of the repository and return its result
    return await this.notInterestedRepository.getNotInterestedById(notInterestedId);
  }
}