// Define a data transfer object (DTO) for Express API requests
export class CallLogModel {
  constructor(
    public jobApplicant: number = 0, // Job applicant ID, defaulting to 0
    public logActivity: string = "", // Log activity, defaulting to an empty string
    public logOutcome: string = "" // Log outcome, defaulting to an empty string
  ) { }
}

// Define an entity class to represent CallLog provided by the CallLog Repository
// This class is used to convert data from the repository to Express API responses
export class CallLogEntity {
  constructor(
    public id: number | undefined = undefined, // Log ID, defaulting to undefined
    public jobApplicant: number, // Job applicant ID
    public logActivity: string, // Log activity
    public logOutcome: string // Log outcome
  ) { }
}

// Create a mapper class to convert between different representations of CallLog data
export class CallLogMapper {
  // Method to convert data to a CallLogEntity
  static toEntity(
    callLogData: any, // Input data to convert
    includeId?: boolean, // Optional flag to include ID in the entity
    existingCallLog?: CallLogEntity // Optional existing CallLogEntity for merging data
  ): CallLogEntity {
    if (existingCallLog != null) {
      // If an existing CallLogEntity is provided, merge data from callLogData with it
      return {
        ...existingCallLog,
        jobApplicant:
          callLogData.jobApplicant !== undefined
            ? callLogData.jobApplicant
            : existingCallLog.jobApplicant,
        logActivity:
          callLogData.logActivity !== undefined
            ? callLogData.logActivity
            : existingCallLog.logActivity,
        logOutcome:
          callLogData.logOutcome !== undefined
            ? callLogData.logOutcome
            : existingCallLog.logOutcome,
      };
    } else {
      // If no existing CallLogEntity is provided, create a new CallLogEntity using callLogData
      const callLogEntity: CallLogEntity = {
        id: includeId
          ? callLogData.id
            ? callLogData.id.toString() // Convert the ID to a string if available
            : undefined
          : callLogData.id.toString(),
        jobApplicant: callLogData.jobApplicant,
        logActivity: callLogData.logActivity,
        logOutcome: callLogData.logOutcome,
      };
      return callLogData; // Should return callLogEntity instead of callLogData
    }
  }

  // Method to convert a CallLogEntity to a generic model object
  static toModel(callLog: CallLogEntity): any {
    return {
      id: callLog.id, // ID of the log
      jobApplicant: callLog.jobApplicant, // Job applicant ID
      logActivity: callLog.logActivity, // Log activity
      logOutcome: callLog.logOutcome, // Log outcome
    };
  }
}
