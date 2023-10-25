// Import necessary dependencies and modules
import { NotInterestedEntity } from "@domain/notInterested/entities/notInterested_entities";
import { NotInterestedRepository } from "@domain/notInterested/repositories/notInterested-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the GetAllNotInteresteds use case
export interface GetAllNotInterestedsUsecase {
    // Define a method called "execute" that returns a Promise
    // It returns an Either type which represents a result that can be either an Error or an array of NotInterestedEntity objects
    execute: () => Promise<Either<ErrorClass, NotInterestedEntity[]>>;
}

// Implement the GetAllNotInteresteds use case
export class GetAllNotInteresteds implements GetAllNotInterestedsUsecase {
    private readonly notInterestedRepository: NotInterestedRepository;

    // Constructor that takes a NotInterestedRepository as a parameter
    constructor(notInterestedRepository: NotInterestedRepository) {
        // Initialize the notInterestedRepository property with the provided repository
        this.notInterestedRepository = notInterestedRepository;
    }

    // Implementation of the "execute" method defined in the interface
    async execute(): Promise<Either<ErrorClass, NotInterestedEntity[]>> {
        // Call the "getNotInteresteds" method of the notInterestedRepository to fetch saved jobs data
        return await this.notInterestedRepository.getNotInteresteds();
    }
}