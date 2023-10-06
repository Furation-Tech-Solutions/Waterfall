// Import necessary modules and dependencies
import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the UpdateCallLog use case
export interface UpdateCallLogUsecase {
  execute: (
    callLogId: string,
    callLogData: CallLogModel
  ) => Promise<Either<ErrorClass, CallLogEntity>>;
}

// Create a class that implements the UpdateCallLogUsecase interface
export class UpdateCallLog implements UpdateCallLogUsecase {
  // Define a private property to hold the callLogRepository instance
  private readonly callLogRepository: CallLogRepository;

  // Constructor to initialize the callLogRepository
  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  // Method to execute the updateCallLog operation
  async execute(
    callLogId: string,
    callLogData: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    // Call the updateCallLog method of the callLogRepository and return the result
    return await this.callLogRepository.updateCallLog(callLogId, callLogData);
  }
}
