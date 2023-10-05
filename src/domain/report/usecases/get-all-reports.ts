import { ReportEntity } from "@domain/report/entities/report";
import { ReportRepository } from "@domain/report/repositories/report-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAllReportsUsecase {
  execute: () => Promise<Either<ErrorClass, ReportEntity[]>>;
}

export class GetAllReports implements GetAllReportsUsecase {
  private readonly reportRepository: ReportRepository;

  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(): Promise<Either<ErrorClass, ReportEntity[]>> {
    return await this.reportRepository.getReports();
  }
}
