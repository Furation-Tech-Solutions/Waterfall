import { BugReportEntity, BugReportModel } from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
export interface UpdateBugReportUsecase {
  execute: (
    bugReportId: string,
    bugReportData: BugReportModel
  ) => Promise<Either<ErrorClass, BugReportEntity>>;
}

export class UpdateBugReport implements UpdateBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository;

  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  async execute(
    bugReportId: string,
    bugReportData: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    return await this.bugReportRepository.updateBugReport(bugReportId, bugReportData);
  }
}
