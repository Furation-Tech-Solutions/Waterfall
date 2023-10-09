// Import necessary modules and dependencies
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

  // Method to create a new CallLog
  async createCallLog(req: Request, res: Response): Promise<void> {
    // Extract CallLog data from the request body and map it to a CallLogModel
    const callLogData: CallLogModel = CallLogMapper.toModel(req.body);

    // Execute the createCallLog use case and get an Either result
    const newCallLog: Either<ErrorClass, CallLogEntity> =
      await this.createCallLogUsecase.execute(callLogData);

    // Handle the result using Either's cata function
    newCallLog.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, map the result to an Entity and send it as a JSON response
      (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Method to delete a CallLog by ID
  async deleteCallLog(req: Request, res: Response): Promise<void> {
    // Extract the CallLog ID from the request parameters
    const callLogId: string = req.params.id;

    // Execute the deleteCallLog use case and get an Either result
    const response: Either<ErrorClass, void> =
      await this.deleteCallLogUsecase.execute(callLogId);

    // Handle the result using Either's cata function
    response.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, send a success message as a JSON response
      () => {
        return res.json({ message: "CallLog deleted successfully." });
      }
    );
  }

  // Method to get a CallLog by ID
  async getCallLogById(req: Request, res: Response): Promise<void> {
    // Extract the CallLog ID from the request parameters
    const callJobId: string = req.params.id;

    // Execute the getCallLogById use case and get an Either result
    const job: Either<ErrorClass, CallLogEntity> =
      await this.getCallLogByIdUsecase.execute(callJobId);

    // Handle the result using Either's cata function
    job.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, map the result to an Entity and send it as a JSON response
      (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Method to update a CallLog by ID
  async updateCallLog(req: Request, res: Response): Promise<void> {
    // Extract the CallLog ID from the request parameters and CallLog data from the body
    const callLogId: string = req.params.id;
    const callLogData: CallLogModel = req.body;

    // Execute the getCallLogById use case to retrieve the existing CallLog
    const existingCallLog: Either<ErrorClass, CallLogEntity> =
      await this.getCallLogByIdUsecase.execute(callLogId);

    // Handle the result using Either's cata function
    existingCallLog.cata(
      // If there's an error, send an error response
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      // If successful, map the result to an Entity and proceed to update
      async (result: CallLogEntity) => {
        const resData = CallLogMapper.toEntity(result, true);

        // Map the updated data to an Entity
        const updatedCallLogEntity: CallLogEntity = CallLogMapper.toEntity(
          callLogData,
          true,
          resData
        );

        // Execute the updateCallLog use case and get an Either result
        const updatedCallLog: Either<ErrorClass, CallLogEntity> =
          await this.updateCallLogUsecase.execute(
            callLogId,
            updatedCallLogEntity
          );

        // Handle the result using Either's cata function
        updatedCallLog.cata(
          // If there's an error, send an error response
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          // If successful, map the result to a Model and send it as a JSON response
          (response: CallLogEntity) => {
            const responseData = CallLogMapper.toModel(response);

            res.json(responseData);
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
    // Execute the getAllCallLogs use case and get an Either result
    const callLogs: Either<ErrorClass, CallLogEntity[]> =
      await this.getAllCallLogsUsecase.execute();

    // Handle the result using Either's cata function
    callLogs.cata(
      // If there's an error, send an error response
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      // If successful, map the results to Entities and send them as a JSON response
      (callLogs: CallLogEntity[]) => {
        const resData = callLogs.map((callLog: any) =>
          CallLogMapper.toEntity(callLog)
        );
        return res.json(resData);
      }
    );
  }
}
