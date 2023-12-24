// Express API request DTO (Data Transfer Object)
export class BugReportModel {
  constructor(
    public realtorId: string = "", // Replace with the appropriate data type if needed
    public description: string = "",
    public attachments: string[] | null = null,
    public timestamp: Date = new Date(),
    public RealtorData: {} = {}
  ) {}
}

// Bug Report Entity provided by Bug Report Repository is converted to Express API Response
export class BugReportEntity {
  constructor(
    public id: number | undefined = undefined,
    public realtorId: string, // Replace with the appropriate data type if needed
    public description: string,
    public attachments: string[] | null,
    public timestamp: Date,
    public RealtorData: {}
  ) {}
}

export class BugReportMapper {
  // Method to convert data to a BugReportEntity
  static toEntity(
    bugReportData: any, // Input data
    includeId?: boolean, // Optional flag to include 'id' in the entity
    existingBugReport?: BugReportEntity // Optional existing BugReportEntity for merging data
  ): BugReportEntity {
    if (existingBugReport != null) {
      // If existingBugReport is provided, merge the data from bugReportData with the existingBugReport
      return {
        ...existingBugReport,
        realtorId:
          bugReportData.realtorId !== undefined
            ? bugReportData.realtorId
            : existingBugReport.realtorId,
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
        realtorId: bugReportData.realtorId,
        description: bugReportData.description,
        attachments: bugReportData.attachments,
        timestamp: bugReportData.timestamp,
        RealtorData: bugReportData.RealtorData,
      };
      // return bugReportEntity;
      return bugReportData; // Consider uncommenting the line above if you want to return the created entity
    }
  }

  // Method to convert a BugReportEntity to a plain JavaScript object (model)
  static toModel(bugReport: BugReportEntity): any {
    return {
      id: bugReport.id,
      realtorId: bugReport.realtorId,
      description: bugReport.description,
      attachments: bugReport.attachments,
      timestamp: bugReport.timestamp,
      RealtorData: bugReport.RealtorData,
    };
  }
}
