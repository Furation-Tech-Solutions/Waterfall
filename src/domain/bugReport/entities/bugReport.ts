// Express API request DTO (Data Transfer Object)
export class BugReportModel {
  constructor(
    public realtor: number = 0, // Replace with the appropriate data type if needed
    public description: string = "",
    public attachments: string[] | null = null,
    public timestamp: Date = new Date()
  ) {}
}

// Bug Report Entity provided by Bug Report Repository is converted to Express API Response
export class BugReportEntity {
  constructor(
    public id: number| undefined = undefined,
    public realtor: number, // Replace with the appropriate data type if needed
    public description: string,
    public attachments: string[] | null,
    public timestamp: Date
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
      // return bugReportEntity;
      return bugReportData;
    }
  }

  // Method to convert a BugReportEntity to a plain JavaScript object (model)
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
