import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface DeleteBugReportUsecase {
  execute: (bugReportId: string) => Promise<Either<ErrorClass, void>>;
}

export class DeleteBugReport implements DeleteBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository;

  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  async execute(bugReportId: string): Promise<Either<ErrorClass, void>> {
    return await this.bugReportRepository.deleteBugReport(bugReportId);
  }
}
