import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import { ReportRepository } from "@domain/report/repositories/report-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
export interface UpdateReportUsecase {
  execute: (
    reportId: string,
    reportData: ReportModel
  ) => Promise<Either<ErrorClass, ReportEntity>>;
}

export class UpdateReport implements UpdateReportUsecase {
  private readonly reportRepository: ReportRepository;

  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(
    reportId: string,
    reportData: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>> {
    return await this.reportRepository.updateReport(reportId, reportData);
  }
}
