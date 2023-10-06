// Import necessary modules and dependencies
import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the CreateCallLogUsecase
export interface CreateCallLogUsecase {
  // Method signature for executing the use case
  execute: (
    callLogData: CallLogModel
  ) => Promise<Either<ErrorClass, CallLogEntity>>;
}

// Create a class that implements the CreateCallLogUsecase interface
export class CreateCallLog implements CreateCallLogUsecase {
  // Define a private property to hold the CallLogRepository instance
  private readonly callLogRepository: CallLogRepository;

  // Constructor to initialize the CallLogRepository
  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  // Implementation of the execute method from the interface
  async execute(
    callLogData: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    // Call the createCallLog method of the CallLogRepository and return the result
    return await this.callLogRepository.createCallLog(callLogData);
  }
}
