// Import necessary modules and classes
import { SupportEntity } from "@domain/support/entities/support"; // Import SupportEntity class for type usage
import { SupportRepository } from "@domain/support/repositories/support-repository"; // Import SupportRepository interface for dependency injection
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass for error handling
import { Either } from "monet"; // Import Either class for handling either success or error result

// Define an interface for the "GetSupportById" use case
export interface GetSupportByIdUsecase {
  execute: (supportId: string) => Promise<Either<ErrorClass, SupportEntity>>;
}

// Implement the "GetSupportById" class that implements the use case interface
export class GetSupportById implements GetSupportByIdUsecase {
  // Private property to store the SupportRepository instance
  private readonly supportRepository: SupportRepository;

  // Constructor to inject the SupportRepository dependency
  constructor(supportRepository: SupportRepository) {
    this.supportRepository = supportRepository;
  }

  // Implementation of the "execute" method from the interface
  async execute(supportId: string): Promise<Either<ErrorClass, SupportEntity>> {
    // Call the "getSupportById" method of the injected repository to fetch support data
    return await this.supportRepository.getSupportById(supportId);
  }
}
