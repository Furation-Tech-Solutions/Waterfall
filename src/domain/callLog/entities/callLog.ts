// Express API request DTO
export class CallLogModel {
  constructor(
    public realtor: string = "",
    public logActivity: string = "",
    public logOutcome: string = ""
  ) {}
}

// CallLog Entity provided by CallLog Repository is converted to Express API Response
export class CallLogEntity {
  constructor(
    public id: string | undefined = undefined,
    public realtor: string,
    public logActivity: string,
    public logOutcome: string
  ) {}
}

export class CallLogMapper {
  static toEntity(
    callLogData: any,
    includeId?: boolean,
    existingCallLog?: CallLogEntity
  ): CallLogEntity {
    if (existingCallLog != null) {
      // If existingCallLog is provided, merge the data from callLogData with the existingCallLog
      return {
        ...existingCallLog,
        realtor:
          callLogData.realtor !== undefined
            ? callLogData.realtor
            : existingCallLog.realtor,
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
      // If existingCallLog is not provided, create a new CallLogEntity using callLogData
      const callLogEntity: CallLogEntity = {
        id: includeId
          ? callLogData.id
            ? callLogData.id.toString()
            : undefined
          : callLogData.id,
        realtor: callLogData.realtor,
        logActivity: callLogData.logActivity,
        logOutcome: callLogData.logOutcome,
      };
      return callLogEntity;
    }
  }

  static toModel(callLog: CallLogEntity): any {
    return {
      id: callLog.id,
      realtor: callLog.realtor,
      logActivity: callLog.logActivity,
      logOutcome: callLog.logOutcome,
    };
  }
}
