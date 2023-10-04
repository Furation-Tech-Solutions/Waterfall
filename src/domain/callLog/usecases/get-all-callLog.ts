import { CallLogEntity } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAllCallLogsUsecase {
  execute: () => Promise<Either<ErrorClass, CallLogEntity[]>>;
}

export class GetAllCallLogs implements GetAllCallLogsUsecase {
  private readonly callLogRepository: CallLogRepository;

  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  async execute(): Promise<Either<ErrorClass, CallLogEntity[]>> {
    return await this.callLogRepository.getCallLogs();
  }
}
