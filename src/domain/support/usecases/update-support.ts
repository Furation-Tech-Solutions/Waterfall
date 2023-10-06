// Import necessary dependencies and modules
import { SupportEntity, SupportModel } from "@domain/support/entities/support";
import { SupportRepository } from "@domain/support/repositories/support-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the "UpdateSupport" use case
export interface UpdateSupportUsecase {
  // Define a method "execute" that takes a supportId (string) and supportData (SupportModel)
  // It returns a Promise that resolves to an Either type with an ErrorClass or a SupportEntity
  execute: (
    supportId: string,
    supportData: SupportModel
  ) => Promise<Either<ErrorClass, SupportEntity>>;
}

// Implement the "UpdateSupport" use case by creating a class that implements the interface
export class UpdateSupport implements UpdateSupportUsecase {
  // Define a private member "supportRepository" of type SupportRepository
  private readonly supportRepository: SupportRepository;

  // Constructor that accepts a "supportRepository" parameter and sets it as a member
  constructor(supportRepository: SupportRepository) {
    this.supportRepository = supportRepository;
  }

  // Implement the "execute" method defined in the interface
  async execute(
    supportId: string,
    supportData: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>> {
    // Call the "updateSupport" method from the "supportRepository" with the provided parameters
    // and return the result as a Promise
    return await this.supportRepository.updateSupport(supportId, supportData);
  }
}
