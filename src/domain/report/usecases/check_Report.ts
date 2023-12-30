import { ReportEntity } from "@domain/report/entities/report"; // Import the ReportEntity from the report entities
import { ReportRepository } from "@domain/report/repositories/report-repository"; // Import the ReportRepository interface
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the API error handling
import { Either } from "monet"; // Import the Either type from the Monet library

// Define the interface for the GetById use case
export interface CheckReportUsecase {
  execute: (id: string, loginId: string) => Promise<Either<ErrorClass, ReportEntity>>;
}

// Implement the GetById use case
export class CheckReport implements CheckReportUsecase {
  private readonly reportRepository: ReportRepository;

  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository;
  }

  // Implementation of the execute method
  // This method retrieves a specific connection by fromId and toId and returns a Promise with an Either result
  async execute(id: string, loginId: string): Promise<Either<ErrorClass, ReportEntity>> {
    // Delegate the retrieval of the specific connection to the ConnectionsRepository
    return await this.reportRepository.checkReport(id, loginId);
  }
}
