// Define a data transfer object (DTO) for Express API requests
export class CallLogModel {
  constructor(
    public jobApplicant: string = "",
    public logActivity: string = "",
    public logOutcome: string = ""
  ) {}
}

// Define an entity class to represent CallLog provided by the CallLog Repository
// This class is used to convert data from the repository to Express API responses
export class CallLogEntity {
  constructor(
    public id: string | undefined = undefined,
    public jobApplicant: string,
    public logActivity: string,
    public logOutcome: string
  ) {}
}

// Create a mapper class to convert between different representations of CallLog data
export class CallLogMapper {
  // Method to convert data to a CallLogEntity
  static toEntity(
    callLogData: any,
    includeId?: boolean,
    existingCallLog?: CallLogEntity
  ): CallLogEntity {
    if (existingCallLog != null) {
      // If an existingCallLog is provided, merge data from callLogData with it
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
      // If no existingCallLog is provided, create a new CallLogEntity using callLogData
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
      return callLogEntity;
    }
  }

  // Method to convert a CallLogEntity to a generic model object
  static toModel(callLog: CallLogEntity): any {
    return {
      id: callLog.id,
      jobApplicant: callLog.jobApplicant,
      logActivity: callLog.logActivity,
      logOutcome: callLog.logOutcome,
    };
  }
}
