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

  // Method to create a bug report
  async createBugReport(req: Request, res: Response): Promise<void> {
    // Extract bug report data from the request body
    const bugReportData: BugReportModel = BugReportMapper.toModel(req.body);

    // Execute the createBugReportUsecase to create a new bug report
    const newBugReport: Either<ErrorClass, BugReportEntity> =
      await this.createBugReportUsecase.execute(bugReportData);

    // Handle the result using the Either monad's cata method
    newBugReport.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: BugReportEntity) => {
        const resData = BugReportMapper.toEntity(result, true);
        return res.json(resData);
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
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: BugReportEntity) => {
        const resData = BugReportMapper.toEntity(result, true);
        return res.json(resData);
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
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: BugReportEntity) => {
        const resData = BugReportMapper.toEntity(result, true);

        // Map the updated bug report data to an entity
        const updatedBugReportEntity: BugReportEntity =
          BugReportMapper.toEntity(bugReportData, true, resData);

        // Execute the updateBugReportUsecase to update the bug report
        const updatedBugReport: Either<ErrorClass, BugReportEntity> =
          await this.updateBugReportUsecase.execute(
            bugReportId,
            updatedBugReportEntity
          );

        // Handle the result of the update using the Either monad's cata method
        updatedBugReport.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: BugReportEntity) => {
            const responseData = BugReportMapper.toModel(response);

            res.json(responseData);
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
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (bugReports: BugReportEntity[]) => {
        // Map bug report entities to the desired format
        const resData = bugReports.map((bugReport: any) =>
          BugReportMapper.toEntity(bugReport)
        );
        return res.json(resData);
      }
    );
  }
}
