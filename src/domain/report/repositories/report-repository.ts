import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface ReportRepository {
  createReport(report: ReportModel): Promise<Either<ErrorClass, ReportEntity>>;
  deleteReport(id: string): Promise<Either<ErrorClass, void>>;
  updateReport(
    id: string,
    data: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>>;
  getReports(): Promise<Either<ErrorClass, ReportEntity[]>>;
  getReportById(id: string): Promise<Either<ErrorClass, ReportEntity>>;
}
