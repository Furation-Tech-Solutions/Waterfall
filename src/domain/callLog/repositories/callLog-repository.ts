// Import necessary modules and dependencies
import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog"; // Importing CallLogEntity and CallLogModel
import { Either } from "monet"; // Importing Either for handling success or error scenarios
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing ErrorClass for error handling
import { CallLogQuery } from "@data/callLog/datasources/callLog-data-sources"; // Importing CallLogQuery for querying

// Define an interface for the CallLogRepository
export interface CallLogRepository {
  // Method to create a new CallLog entry
  createCallLog(
    callLog: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>>; // Returns a promise with either an ErrorClass or the created CallLogEntity

  // Method to delete a CallLog entry by its ID
  deleteCallLog(id: string): Promise<Either<ErrorClass, void>>; // Returns a promise with either an ErrorClass or void (for successful deletion)

  // Method to update a CallLog entry by its ID with new data
  updateCallLog(
    id: string,
    data: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>>; // Returns a promise with either an ErrorClass or the updated CallLogEntity

  // Method to retrieve all CallLog entries based on a query
  getCallLogs(
    query: CallLogQuery
  ): Promise<Either<ErrorClass, CallLogEntity[]>>; // Returns a promise with either an ErrorClass or an array of CallLogEntities

  // Method to retrieve a specific CallLog entry by its ID
  getCallLogById(id: string): Promise<Either<ErrorClass, CallLogEntity>>; // Returns a promise with either an ErrorClass or the specific CallLogEntity identified by its ID
}
