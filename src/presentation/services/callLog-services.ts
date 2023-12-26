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

// Create a class for the CallLogService
export class CallLogService {
  // Define private properties to hold use case instances
  private readonly createCallLogUsecase: CreateCallLogUsecase;
  private readonly deleteCallLogUsecase: DeleteCallLogUsecase;
  private readonly getCallLogByIdUsecase: GetCallLogByIdUsecase;
  private readonly updateCallLogUsecase: UpdateCallLogUsecase;
  private readonly getAllCallLogsUsecase: GetAllCallLogsUsecase;

  // Constructor to initialize use case instances
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

  // Helper method to send success response
  private sendSuccessResponse(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Helper method to send error response
  private sendErrorResponse(
    res: Response,
    error: ErrorClass,
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Method to create a new CallLog
  async createCallLog(req: Request, res: Response): Promise<void> {
    const callLogData: CallLogModel = CallLogMapper.toModel(req.body);

    const newCallLog: Either<ErrorClass, CallLogEntity> =
      await this.createCallLogUsecase.execute(callLogData);

    newCallLog.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Bad Request
      (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "CallLog created successfully",
          201
        );
      }
    );
  }

  // Method to delete a CallLog by ID
  async deleteCallLog(req: Request, res: Response): Promise<void> {
    const callLogId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteCallLogUsecase.execute(callLogId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "CallLog deleted successfully",
          204
        ); // No Content
      }
    );
  }

  // Method to get a CallLog by ID
  async getCallLogById(req: Request, res: Response): Promise<void> {
    const callLogId: string = req.params.id;

    const job: Either<ErrorClass, CallLogEntity> =
      await this.getCallLogByIdUsecase.execute(callLogId);

    job.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "CallLog retrieved successfully"
        );
      }
    );
  }

  // Method to update a CallLog by ID
  async updateCallLog(req: Request, res: Response): Promise<void> {
    const callLogId: string = req.params.id;
    const callLogData: CallLogModel = req.body;

    const existingCallLog: Either<ErrorClass, CallLogEntity> =
      await this.getCallLogByIdUsecase.execute(callLogId);

    existingCallLog.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
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
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
          (response: CallLogEntity) => {
            const responseData = CallLogMapper.toModel(response);
            this.sendSuccessResponse(
              res,
              responseData,
              "CallLog updated successfully"
            );
          }
        );
      }
    );
  }

  // Method to get all CallLogs
  async getAllCallLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let Id = req.headers.id;
    let Id = req.user;

    const query: any = {}; // Create an empty query object
    // Assign values to properties of the query object
    query.id = Id;
    query.page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
    query.limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number

    // Execute the getAllCallLogs use case and get an Either result
    const callLogs: Either<ErrorClass, CallLogEntity[]> =
      await this.getAllCallLogsUsecase.execute(query);

    callLogs.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Internal Server Error
      (callLogs: CallLogEntity[]) => {
        const resData = callLogs.map((callLog: any) =>
          CallLogMapper.toEntity(callLog)
        );
        this.sendSuccessResponse(
          res,
          resData,
          "CallLogs retrieved successfully"
        );
      }
    );
  }
}
