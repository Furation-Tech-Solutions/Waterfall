import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
export interface UpdateCallLogUsecase {
  execute: (
    callLogId: string,
    callLogData: CallLogModel
  ) => Promise<Either<ErrorClass, CallLogEntity>>;
}

export class UpdateCallLog implements UpdateCallLogUsecase {
  private readonly callLogRepository: CallLogRepository;

  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  async execute(
    callLogId: string,
    callLogData: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    return await this.callLogRepository.updateCallLog(callLogId, callLogData);
  }
}
