import { BugReportEntity } from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAllBugReportsUsecase {
  execute: () => Promise<Either<ErrorClass, BugReportEntity[]>>;
}

export class GetAllBugReports implements GetAllBugReportsUsecase {
  private readonly bugReportRepository: BugReportRepository;

  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  async execute(): Promise<Either<ErrorClass, BugReportEntity[]>> {
    return await this.bugReportRepository.getBugReports();
  }
}
