// Import necessary modules and dependencies
import { CallLogEntity } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the GetCallLogById use case
export interface GetCallLogByIdUsecase {
  // Define a method 'execute' that takes a callLogId and returns a Promise of Either
  execute: (callLogId: string) => Promise<Either<ErrorClass, CallLogEntity>>;
}

// Implement the GetCallLogById use case class that adheres to the GetCallLogByIdUsecase interface
export class GetCallLogById implements GetCallLogByIdUsecase {
  // Define a private property to hold the CallLogRepository instance
  private readonly callLogRepository: CallLogRepository;

  // Constructor to initialize the CallLogRepository instance
  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  // Implementation of the 'execute' method from the interface
  async execute(callLogId: string): Promise<Either<ErrorClass, CallLogEntity>> {
    // Use the CallLogRepository to get a CallLogEntity by its ID and return the result
    return await this.callLogRepository.getCallLogById(callLogId);
  }
}
