import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import { ReportRepository } from "@domain/report/repositories/report-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateReportUsecase {
  execute: (
    reportData: ReportModel
  ) => Promise<Either<ErrorClass, ReportEntity>>;
}

export class CreateReport implements CreateReportUsecase {
  private readonly reportRepository: ReportRepository;

  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(
    reportData: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>> {
    return await this.reportRepository.createReport(reportData);
  }
}
