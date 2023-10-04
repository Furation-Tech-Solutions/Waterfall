import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateCallLogUsecase {
  execute: (
    callLogData: CallLogModel
  ) => Promise<Either<ErrorClass, CallLogEntity>>;
}

export class CreateCallLog implements CreateCallLogUsecase {
  private readonly callLogRepository: CallLogRepository;

  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  async execute(
    callLogData: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    return await this.callLogRepository.createCallLog(callLogData);
  }
}
