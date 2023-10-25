// Import necessary modules and types from external dependencies
import {
    NotInterestedEntity,
    NotInterestedModel,
  } from "@domain/notInterested/entities/notInterested_entities";
  import { NotInterestedRepository } from "@domain/notInterested/repositories/notInterested-repository";
  import { ErrorClass } from "@presentation/error-handling/api-error";
  import { Either } from "monet";
  
  // Define an interface for the CreateNotInterested use case
  export interface CreateNotInterestedUsecase {
    // Define a method called 'execute' that takes 'notInterestedData' of type 'NotInterestedModel'
    // and returns a Promise that resolves to an 'Either' containing 'ErrorClass' or 'NotInterestedEntity'.
    execute: (
      notInterestedData: NotInterestedModel
    ) => Promise<Either<ErrorClass, NotInterestedEntity>>;
  }
  
  // Implement the CreateNotInterested use case class that implements the CreateNotInterestedUsecase interface
  export class CreateNotInterested implements CreateNotInterestedUsecase {
    // Declare a private member variable 'notInterestedRepository' of type 'NotInterestedRepository'
    private readonly notInterestedRepository: NotInterestedRepository;
  
    // Constructor for the CreateNotInterested class that takes a 'notInterestedRepository' parameter
    constructor(notInterestedRepository: NotInterestedRepository) {
      // Assign the 'notInterestedRepository' parameter to the class member variable
      this.notInterestedRepository = notInterestedRepository;
    }
  
    // Implement the 'execute' method from the interface
    async execute(
      notInterestedData: NotInterestedModel
    ): Promise<Either<ErrorClass, NotInterestedEntity>> {
      // Call the 'createNotInterested' method from 'notInterestedRepository' with 'notInterestedData'
      // and return the result as a Promise
      return await this.notInterestedRepository.createNotInterested(notInterestedData);
    }
  }