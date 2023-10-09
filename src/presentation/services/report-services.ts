import { NextFunction, Request, Response } from "express";
import {
  ReportEntity,
  ReportModel,
  ReportMapper,
} from "@domain/report/entities/report";
import { CreateReportUsecase } from "@domain/report/usecases/create-report";
import { DeleteReportUsecase } from "@domain/report/usecases/delete-report";
import { GetReportByIdUsecase } from "@domain/report/usecases/get-report-by-id";
import { UpdateReportUsecase } from "@domain/report/usecases/update-report";
import { GetAllReportsUsecase } from "@domain/report/usecases/get-all-reports";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Create a class for the ReportService
export class ReportService {
  private readonly createReportUsecase: CreateReportUsecase;
  private readonly deleteReportUsecase: DeleteReportUsecase;
  private readonly getReportByIdUsecase: GetReportByIdUsecase;
  private readonly updateReportUsecase: UpdateReportUsecase;
  private readonly getAllReportsUsecase: GetAllReportsUsecase;

  // Constructor to initialize dependencies
  constructor(
    createReportUsecase: CreateReportUsecase,
    deleteReportUsecase: DeleteReportUsecase,
    getReportByIdUsecase: GetReportByIdUsecase,
    updateReportUsecase: UpdateReportUsecase,
    getAllReportsUsecase: GetAllReportsUsecase
  ) {
    this.createReportUsecase = createReportUsecase;
    this.deleteReportUsecase = deleteReportUsecase;
    this.getReportByIdUsecase = getReportByIdUsecase;
    this.updateReportUsecase = updateReportUsecase;
    this.getAllReportsUsecase = getAllReportsUsecase;
  }

  // Function to create a new report
  async createReport(req: Request, res: Response): Promise<void> {
    // Extract report data from the request body
    const reportData: ReportModel = ReportMapper.toModel(req.body);

    // Execute the createReportUsecase and handle the result using Either
    const newReport: Either<ErrorClass, ReportEntity> =
      await this.createReportUsecase.execute(reportData);

    // Handle the result and send a JSON response
    newReport.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: ReportEntity) => {
        const resData = ReportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to delete a report
  async deleteReport(req: Request, res: Response): Promise<void> {
    // Extract report ID from the request parameters
    const reportId: string = req.params.id;

    // Execute the deleteReportUsecase and handle the result using Either
    const response: Either<ErrorClass, void> =
      await this.deleteReportUsecase.execute(reportId);

    // Handle the result and send a JSON response
    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "Report deleted successfully." });
      }
    );
  }

  // Function to get a report by ID
  async getReportById(req: Request, res: Response): Promise<void> {
    // Extract report ID from the request parameters
    const reportId: string = req.params.id;

    // Execute the getReportByIdUsecase and handle the result using Either
    const report: Either<ErrorClass, ReportEntity> =
      await this.getReportByIdUsecase.execute(reportId);

    // Handle the result and send a JSON response
    report.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: ReportEntity) => {
        const resData = ReportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to update a report
  async updateReport(req: Request, res: Response): Promise<void> {
    // Extract report ID from the request parameters
    const reportId: string = req.params.id;
    // Extract report data from the request body
    const reportData: ReportModel = req.body;

    // Execute the getReportByIdUsecase to fetch the existing report
    const existingReport: Either<ErrorClass, ReportEntity> =
      await this.getReportByIdUsecase.execute(reportId);

    // Handle the result of fetching the existing report
    existingReport.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: ReportEntity) => {
        const resData = ReportMapper.toEntity(result, true);

        // Map the updated report data to an entity
        const updatedReportEntity: ReportEntity = ReportMapper.toEntity(
          reportData,
          true,
          resData
        );

        // Execute the updateReportUsecase and handle the result using Either
        const updatedReport: Either<ErrorClass, ReportEntity> =
          await this.updateReportUsecase.execute(reportId, updatedReportEntity);

        // Handle the result and send a JSON response
        updatedReport.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: ReportEntity) => {
            const responseData = ReportMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  // Function to get all reports
  async getAllReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllReportsUsecase and handle the result using Either
    const reports: Either<ErrorClass, ReportEntity[]> =
      await this.getAllReportsUsecase.execute();

    // Handle the result and send a JSON response
    reports.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (reports: ReportEntity[]) => {
        const resData = reports.map((report: any) =>
          ReportMapper.toEntity(report)
        );
        return res.json(resData);
      }
    );
  }
}
