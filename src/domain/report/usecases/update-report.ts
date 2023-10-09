// Import necessary entities and dependencies
import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import { ReportRepository } from "@domain/report/repositories/report-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define the interface for the UpdateReportUsecase
export interface UpdateReportUsecase {
  // Define the execute method signature, which takes reportId and reportData as parameters
  execute: (
    reportId: string,
    reportData: ReportModel
  ) => Promise<Either<ErrorClass, ReportEntity>>;
}

// Implement the UpdateReportUsecase interface in the UpdateReport class
export class UpdateReport implements UpdateReportUsecase {
  private readonly reportRepository: ReportRepository;

  // Constructor to initialize the reportRepository dependency
  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository;
  }

  // Implementation of the execute method from the interface
  async execute(
    reportId: string,
    reportData: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>> {
    // Call the updateReport method of the reportRepository with reportId and reportData
    // and return the result as an Either monad
    return await this.reportRepository.updateReport(reportId, reportData);
  }
}
