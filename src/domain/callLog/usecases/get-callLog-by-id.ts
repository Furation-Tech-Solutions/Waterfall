import { CallLogEntity } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetCallLogByIdUsecase {
  execute: (callLogId: string) => Promise<Either<ErrorClass, CallLogEntity>>;
}

export class GetCallLogById implements GetCallLogByIdUsecase {
  private readonly callLogRepository: CallLogRepository;

  constructor(callLogRepository: CallLogRepository) {
    this.callLogRepository = callLogRepository;
  }

  async execute(callLogId: string): Promise<Either<ErrorClass, CallLogEntity>> {
    return await this.callLogRepository.getCallLogById(callLogId);
  }
}
