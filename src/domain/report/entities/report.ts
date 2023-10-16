// Define a class for ReportModel, representing the data structure used for creating reports
export class ReportModel {
  constructor(
    public fromRealtor: number = 0,
    public toRealtor: number = 0,
    public description: string = "",
    public reportTimestamp: Date = new Date()
  ) {}
}

// Define a class for ReportEntity, representing the data structure used for storing reports in the database
export class ReportEntity {
  constructor(
    public id: number| undefined = undefined, // An optional unique identifier for the report
    public fromRealtor: number, // The name of the reporting realtor
    public toRealtor: number, // The name of the realtor being reported to
    public description: string, // The description or details of the report
    public reportTimestamp: Date // The timestamp when the report was created
  ) {}
}

// Define a class for ReportMapper, responsible for mapping between ReportModel and ReportEntity
export class ReportMapper {
  // Static method to convert report data to a ReportEntity
  static toEntity(
    reportData: any, // Input data, typically a ReportModel or object
    includeId?: boolean, // Optionally include the ID in the ReportEntity
    existingReport?: ReportEntity // Optionally provide an existing ReportEntity to update
  ): ReportEntity {
    if (existingReport != null) {
      // If an existing report is provided, merge the data from reportData with the existing report
      return {
        ...existingReport,
        fromRealtor:
          reportData.fromRealtor !== undefined
            ? reportData.fromRealtor
            : existingReport.fromRealtor,
        toRealtor:
          reportData.toRealtor !== undefined
            ? reportData.toRealtor
            : existingReport.toRealtor,
        description:
          reportData.description !== undefined
            ? reportData.description
            : existingReport.description,
        reportTimestamp:
          reportData.reportTimestamp !== undefined
            ? reportData.reportTimestamp
            : existingReport.reportTimestamp,
      };
    } else {
      // If an existing report is not provided, create a new ReportEntity using reportData
      const reportEntity: ReportEntity = {
        id: includeId
          ? reportData.id
            ? reportData.id.toString() // Convert ID to string if it exists
            : undefined
          : reportData.id.toString(),
        fromRealtor: reportData.fromRealtor,
        toRealtor: reportData.toRealtor,
        description: reportData.description,
        reportTimestamp: reportData.reportTimestamp,
      };
      return reportData;
    }
  }

  // Static method to convert a ReportEntity to a simple object (model) for JSON response
  static toModel(report: ReportEntity): any {
    return {
      id: report.id, // Include the ID if available
      fromRealtor: report.fromRealtor,
      toRealtor: report.toRealtor,
      description: report.description,
      reportTimestamp: report.reportTimestamp,
    };
  }
}
