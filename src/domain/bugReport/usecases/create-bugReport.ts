import { BugReportEntity, BugReportModel } from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateBugReportUsecase {
  execute: (bugReportData: BugReportModel) => Promise<Either<ErrorClass, BugReportEntity>>;
}

export class CreateBugReport implements CreateBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository;

  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  async execute(bugReportData: BugReportModel): Promise<Either<ErrorClass, BugReportEntity>> {
    return await this.bugReportRepository.createBugReport(bugReportData);
  }
}
