// Import necessary modules and dependencies
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define the interface for the DeleteCallLogUsecase
export interface DeleteCallLogUsecase {
  // Method signature to delete a call log by ID and return a Promise with an Either result
  execute: (callLogId: string) => Promise<Either<ErrorClass, void>>;
}

// Implement the DeleteCallLogUsecase interface as a class
export class DeleteCallLog implements DeleteCallLogUsecase {
  // Define a private property to hold the callLogRepository instance
  private readonly callLogRepository: CallLogRepository;

  // Constructor to initialize the callLogRepository
  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  // Implementation of the execute method from the interface
  async execute(callLogId: string): Promise<Either<ErrorClass, void>> {
    // Call the deleteCallLog method of the callLogRepository and return its result
    return await this.callLogRepository.deleteCallLog(callLogId);
  }
}
