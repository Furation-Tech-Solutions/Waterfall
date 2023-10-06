import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface DeleteCallLogUsecase {
  execute: (callLogId: string) => Promise<Either<ErrorClass, void>>;
}

export class DeleteCallLog implements DeleteCallLogUsecase {
  private readonly callLogRepository: CallLogRepository;

  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  async execute(callLogId: string): Promise<Either<ErrorClass, void>> {
    return await this.callLogRepository.deleteCallLog(callLogId);
  }
}
