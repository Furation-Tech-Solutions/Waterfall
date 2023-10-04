import { NextFunction, Request, Response } from "express";
import {
  CallLogEntity,
  CallLogModel,
  CallLogMapper,
} from "@domain/callLog/entities/callLog";
import { CreateCallLogUsecase } from "@domain/callLog/usecases/create-callLog";
import { DeleteCallLogUsecase } from "@domain/callLog/usecases/delete-callLog";
import { GetCallLogByIdUsecase } from "@domain/callLog/usecases/get-callLog-by-id";
import { UpdateCallLogUsecase } from "@domain/callLog/usecases/update-callLog";
import { GetAllCallLogsUsecase } from "@domain/callLog/usecases/get-all-callLog";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class CallLogService {
  private readonly createCallLogUsecase: CreateCallLogUsecase;
  private readonly deleteCallLogUsecase: DeleteCallLogUsecase;
  private readonly getCallLogByIdUsecase: GetCallLogByIdUsecase;
  private readonly updateCallLogUsecase: UpdateCallLogUsecase;
  private readonly getAllCallLogsUsecase: GetAllCallLogsUsecase;

  constructor(
    createCallLogUsecase: CreateCallLogUsecase,
    deleteCallLogUsecase: DeleteCallLogUsecase,
    getCallLogByIdUsecase: GetCallLogByIdUsecase,
    updateCallLogUsecase: UpdateCallLogUsecase,
    getAllCallLogsUsecase: GetAllCallLogsUsecase
  ) {
    this.createCallLogUsecase = createCallLogUsecase;
    this.deleteCallLogUsecase = deleteCallLogUsecase;
    this.getCallLogByIdUsecase = getCallLogByIdUsecase;
    this.updateCallLogUsecase = updateCallLogUsecase;
    this.getAllCallLogsUsecase = getAllCallLogsUsecase;
  }

  async createCallLog(req: Request, res: Response): Promise<void> {
    const callLogData: CallLogModel = CallLogMapper.toModel(req.body);

    const newCallLog: Either<ErrorClass, CallLogEntity> =
      await this.createCallLogUsecase.execute(callLogData);

    newCallLog.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async deleteCallLog(req: Request, res: Response): Promise<void> {
    const callLogId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteCallLogUsecase.execute(callLogId);

    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "CallLog deleted successfully." });
      }
    );
  }

  async getCallLogById(req: Request, res: Response): Promise<void> {
    const callJobId: string = req.params.id;

    const job: Either<ErrorClass, CallLogEntity> =
      await this.getCallLogByIdUsecase.execute(callJobId);

    job.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async updateCallLog(req: Request, res: Response): Promise<void> {
    const callLogId: string = req.params.id;
    const callLogData: CallLogModel = req.body;

    const existingCallLog: Either<ErrorClass, CallLogEntity> =
      await this.getCallLogByIdUsecase.execute(callLogId);

    existingCallLog.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);

        const updatedCallLogEntity: CallLogEntity = CallLogMapper.toEntity(
          callLogData,
          true,
          resData
        );

        const updatedCallLog: Either<ErrorClass, CallLogEntity> =
          await this.updateCallLogUsecase.execute(
            callLogId,
            updatedCallLogEntity
          );

        updatedCallLog.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: CallLogEntity) => {
            const responseData = CallLogMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  async getAllCallLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const callLogs: Either<ErrorClass, CallLogEntity[]> =
      await this.getAllCallLogsUsecase.execute();

    callLogs.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (callLogs: CallLogEntity[]) => {
        const resData = callLogs.map((callLog: any) =>
          CallLogMapper.toEntity(callLog)
        );
        return res.json(resData);
      }
    );
  }
}
