import { BugReportEntity } from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetBugReportByIdUsecase {
  execute: (bugReportId: string) => Promise<Either<ErrorClass, BugReportEntity>>;
}

export class GetBugReportById implements GetBugReportByIdUsecase {
  private readonly bugReportRepository: BugReportRepository;

  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  async execute(bugReportId: string): Promise<Either<ErrorClass, BugReportEntity>> {
    return await this.bugReportRepository.getBugReportById(bugReportId);
  }
}
