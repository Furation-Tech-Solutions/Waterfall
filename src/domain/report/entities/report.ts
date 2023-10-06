export class ReportModel {
  constructor(
    public fromRealtor: string = "",
    public toRealtor: string = "",
    public description: string = "",
    public reportTimestamp: Date = new Date()
  ) {}
}

export class ReportEntity {
  constructor(
    public id: string | undefined = undefined,
    public fromRealtor: string,
    public toRealtor: string,
    public description: string,
    public reportTimestamp: Date
  ) {}
}

export class ReportMapper {
  static toEntity(
    reportData: any,
    includeId?: boolean,
    existingReport?: ReportEntity
  ): ReportEntity {
    if (existingReport != null) {
      // If existingReport is provided, merge the data from reportData with the existingReport
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
      // If existingReport is not provided, create a new ReportEntity using reportData
      const reportEntity: ReportEntity = {
        id: includeId
          ? reportData.id
            ? reportData.id.toString()
            : undefined
          : reportData.id.toString(),
        fromRealtor: reportData.fromRealtor,
        toRealtor: reportData.toRealtor,
        description: reportData.description,
        reportTimestamp: reportData.reportTimestamp,
      };
      return reportEntity;
    }
  }

  static toModel(report: ReportEntity): any {
    return {
      id: report.id,
      fromRealtor: report.fromRealtor,
      toRealtor: report.toRealtor,
      description: report.description,
      reportTimestamp: report.reportTimestamp,
    };
  }
}
