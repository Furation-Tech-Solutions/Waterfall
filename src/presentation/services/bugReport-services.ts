import { NextFunction, Request, Response } from "express";
import {
  BugReportEntity,
  BugReportModel,
  BugReportMapper,
} from "@domain/bugReport/entities/bugReport";
import { CreateBugReportUsecase } from "@domain/bugReport/usecases/create-bugReport";
import { DeleteBugReportUsecase } from "@domain/bugReport/usecases/delete-bugReport";
import { GetBugReportByIdUsecase } from "@domain/bugReport/usecases/get-bugReport-by-id";
import { UpdateBugReportUsecase } from "@domain/bugReport/usecases/update-bugReport";
import { GetAllBugReportsUsecase } from "@domain/bugReport/usecases/get-all-bugReports";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import { not } from "joi";
import { NOTFOUND } from "dns";

// Define a class named BugReportService
export class BugReportService {
  // Declare private properties to store various use cases
  private readonly createBugReportUsecase: CreateBugReportUsecase;
  private readonly deleteBugReportUsecase: DeleteBugReportUsecase;
  private readonly getBugReportByIdUsecase: GetBugReportByIdUsecase;
  private readonly updateBugReportUsecase: UpdateBugReportUsecase;
  private readonly getAllBugReportsUsecase: GetAllBugReportsUsecase;

  // Constructor to initialize the use cases
  constructor(
    createBugReportUsecase: CreateBugReportUsecase,
    deleteBugReportUsecase: DeleteBugReportUsecase,
    getBugReportByIdUsecase: GetBugReportByIdUsecase,
    updateBugReportUsecase: UpdateBugReportUsecase,
    getAllBugReportsUsecase: GetAllBugReportsUsecase
  ) {
    this.createBugReportUsecase = createBugReportUsecase;
    this.deleteBugReportUsecase = deleteBugReportUsecase;
    this.getBugReportByIdUsecase = getBugReportByIdUsecase;
    this.updateBugReportUsecase = updateBugReportUsecase;
    this.getAllBugReportsUsecase = getAllBugReportsUsecase;
  }

  private sendSuccessResponse(res: Response, data: any, message: string = "Success", statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  private sendErrorResponse(res: Response, error: ErrorClass, statusCode: number = 500): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Method to create a bug report
  async createBugReport(req: Request, res: Response): Promise<void> {
    // Extract bug report data from the request body
    const bugReportData: BugReportModel = BugReportMapper.toModel(req.body);

    // Execute the createBugReportUsecase to create a new bug report
    const newBugReport: Either<ErrorClass, BugReportEntity> =
      await this.createBugReportUsecase.execute(bugReportData);

    // Handle the result using the Either monad's cata method
    newBugReport.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 400), // Bad Request
      (result: BugReportEntity) => {
        const resData = BugReportMapper.toEntity(result, true);
        this.sendSuccessResponse(res, resData, "BugReport created successfully", 201);
      }
    );
  }

  // Method to delete a bug report by ID
  async deleteBugReport(req: Request, res: Response): Promise<void> {
    // Extract the bug report ID from the request parameters
    const bugReportId: string = req.params.id;

    // Execute the deleteBugReportUsecase to delete the bug report
    const response: Either<ErrorClass, void> =
      await this.deleteBugReportUsecase.execute(bugReportId);

    // Handle the result using the Either monad's cata method
    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "BugReport deleted successfully." });
      }
    );
  }

  // Method to get a bug report by ID
  async getBugReportById(req: Request, res: Response): Promise<void> {
    // Extract the bug report ID from the request parameters
    const bugReportId: string = req.params.id;

    // Execute the getBugReportByIdUsecase to retrieve the bug report
    const bugReport: Either<ErrorClass, BugReportEntity> =
      await this.getBugReportByIdUsecase.execute(bugReportId);

    // Handle the result using the Either monad's cata method
    bugReport.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: BugReportEntity) => {
        if (!result) {
          this.sendErrorResponse(res, new ApiError(400, " not found"));
        } else {
          const resData = BugReportMapper.toEntity(result);
          this.sendSuccessResponse(res, resData, "BugReport retrieved successfully");
        }
      }
    );
  }

  // Method to update a bug report
  async updateBugReport(req: Request, res: Response): Promise<void> {
    // Extract the bug report ID from the request parameters
    const bugReportId: string = req.params.id;
    // Extract bug report data from the request body
    const bugReportData: BugReportModel = req.body;

    // Execute the getBugReportByIdUsecase to retrieve the existing bug report
    const existingBugReport: Either<ErrorClass, BugReportEntity> =
      await this.getBugReportByIdUsecase.execute(bugReportId);

    // Handle the result using the Either monad's cata method
    existingBugReport.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      async (existingBugReportData: BugReportEntity) => {
        const updatedBugReportEntity: BugReportEntity = BugReportMapper.toEntity(
          bugReportData,
          true,
          existingBugReportData
        );

        const updatedBugReport: Either<ErrorClass, BugReportEntity> =
          await this.updateBugReportUsecase.execute(
            bugReportId,
            updatedBugReportEntity
          );

        updatedBugReport.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
          (result: BugReportEntity) => {
            const resData = BugReportMapper.toEntity(result, true);
            this.sendSuccessResponse(res, resData, "BugReport updated successfully");
          }
        );
      }
    );
  }

  // Method to get all bug reports
  async getAllBugReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllBugReportsUsecase to retrieve all bug reports
    const bugReports: Either<ErrorClass, BugReportEntity[]> =
      await this.getAllBugReportsUsecase.execute();

    // Handle the result using the Either monad's cata method
    bugReports.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Internal Server Error
      (result: BugReportEntity[]) => {
        const responseData = result.map((blocking) =>
          BugReportMapper.toEntity(blocking)
        );
        this.sendSuccessResponse(res, responseData, "BugReport retrieved successfully");
      }
    );
  }
}
