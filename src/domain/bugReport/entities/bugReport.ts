// Express API request DTO
export class BugReportModel {
  constructor(
    public realtor: string = "", // Replace with the appropriate data type if needed
    public description: string = "",
    public attachments: string[] | null = null,
    public timestamp: Date = new Date()
  ) {}
}

// Bug Report Entity provided by Bug Report Repository is converted to Express API Response
export class BugReportEntity {
  constructor(
    public id: string | undefined = undefined,
    public realtor: string, // Replace with the appropriate data type if needed
    public description: string,
    public attachments: string[] | null,
    public timestamp: Date
  ) {}
}

export class BugReportMapper {
  static toEntity(
    bugReportData: any,
    includeId?: boolean,
    existingBugReport?: BugReportEntity
  ): BugReportEntity {
    if (existingBugReport != null) {
      // If existingBugReport is provided, merge the data from bugReportData with the existingBugReport
      return {
        ...existingBugReport,
        realtor:
          bugReportData.realtor !== undefined
            ? bugReportData.realtor
            : existingBugReport.realtor,
        description:
          bugReportData.description !== undefined
            ? bugReportData.description
            : existingBugReport.description,
        attachments:
          bugReportData.attachments !== undefined
            ? bugReportData.attachments
            : existingBugReport.attachments,
        timestamp:
          bugReportData.timestamp !== undefined
            ? bugReportData.timestamp
            : existingBugReport.timestamp,
      };
    } else {
      // If existingBugReport is not provided, create a new BugReportEntity using bugReportData
      const bugReportEntity: BugReportEntity = {
        id: includeId
          ? bugReportData.id
            ? bugReportData.id.toString()
            : undefined
          : bugReportData.id.toString(),
        realtor: bugReportData.realtor,
        description: bugReportData.description,
        attachments: bugReportData.attachments,
        timestamp: bugReportData.timestamp,
      };
      return bugReportEntity;
    }
  }

  static toModel(bugReport: BugReportEntity): any {
    return {
      id: bugReport.id,
      realtor: bugReport.realtor,
      description: bugReport.description,
      attachments: bugReport.attachments,
      timestamp: bugReport.timestamp,
    };
  }
}
