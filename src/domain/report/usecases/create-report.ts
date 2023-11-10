// Import necessary entities and dependencies from their respective domains
import { ReportEntity, ReportModel } from "@domain/report/entities/report"; // Import ReportEntity and ReportModel from the report domain
import { ReportRepository } from "@domain/report/repositories/report-repository"; // Import ReportRepository from the report domain
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass for error handling
import { Either } from "monet"; // Import Either for functional error handling

// Define the interface for the CreateReportUsecase
export interface CreateReportUsecase {
  // Method signature for the use case, takes reportData and returns a Promise of Either type with ErrorClass or ReportEntity
  execute: (reportData: ReportModel) => Promise<Either<ErrorClass, ReportEntity>>;
}

// Implement the CreateReportUsecase interface in the CreateReport class
export class CreateReport implements CreateReportUsecase {
  // Private member to hold the report repository instance
  private readonly reportRepository: ReportRepository;

  // Constructor to inject the report repository dependency
  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository;
  }

  // Implementation of the execute method defined in the interface
  async execute(reportData: ReportModel): Promise<Either<ErrorClass, ReportEntity>> {
    // Call the createReport method on the report repository and return the result
    return await this.reportRepository.createReport(reportData);
  }
}
