// Import necessary modules and dependencies
import { CallLogEntity } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the GetAllCallLogsUsecase
export interface GetAllCallLogsUsecase {
  // Define a method called execute that returns a Promise of Either
  execute: () => Promise<Either<ErrorClass, CallLogEntity[]>>;
}

// Create a class GetAllCallLogs that implements the GetAllCallLogsUsecase interface
export class GetAllCallLogs implements GetAllCallLogsUsecase {
  // Define a private property to hold the CallLogRepository instance
  private readonly callLogRepository: CallLogRepository;

  // Constructor to initialize the CallLogRepository instance
  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  // Implementation of the execute method
  async execute(): Promise<Either<ErrorClass, CallLogEntity[]>> {
    // Call the getCallLogs method of the CallLogRepository and return the result
    return await this.callLogRepository.getCallLogs();
  }
}
