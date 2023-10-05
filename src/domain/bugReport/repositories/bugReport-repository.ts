import { BugReportEntity, BugReportModel } from "@domain/bugReport/entities/bugReport";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface BugReportRepository {
  createBugReport(bugReport: BugReportModel): Promise<Either<ErrorClass, BugReportEntity>>;
  deleteBugReport(id: string): Promise<Either<ErrorClass, void>>;
  updateBugReport(id: string, data: BugReportModel): Promise<Either<ErrorClass, BugReportEntity>>;
  getBugReports(): Promise<Either<ErrorClass, BugReportEntity[]>>;
  getBugReportById(id: string): Promise<Either<ErrorClass, BugReportEntity>>;
}
