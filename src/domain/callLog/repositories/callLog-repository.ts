import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface CallLogRepository {
  createCallLog(
    callLog: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>>;
  deleteCallLog(id: string): Promise<Either<ErrorClass, void>>;
  updateCallLog(
    id: string,
    data: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>>;
  getCallLogs(): Promise<Either<ErrorClass, CallLogEntity[]>>;
  getCallLogById(id: string): Promise<Either<ErrorClass, CallLogEntity>>;
}
