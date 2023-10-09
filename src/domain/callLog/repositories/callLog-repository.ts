// Import necessary modules and dependencies
import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

// Define an interface for the CallLogRepository
export interface CallLogRepository {
  // Method to create a new CallLog entry
  createCallLog(
    callLog: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>>;

  // Method to delete a CallLog entry by its ID
  deleteCallLog(id: string): Promise<Either<ErrorClass, void>>;

  // Method to update a CallLog entry by its ID with new data
  updateCallLog(
    id: string,
    data: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>>;

  // Method to retrieve all CallLog entries
  getCallLogs(): Promise<Either<ErrorClass, CallLogEntity[]>>;

  // Method to retrieve a specific CallLog entry by its ID
  getCallLogById(id: string): Promise<Either<ErrorClass, CallLogEntity>>;
}
