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

export class ReportService {
  private readonly createReportUsecase: CreateReportUsecase;
  private readonly deleteReportUsecase: DeleteReportUsecase;
  private readonly getReportByIdUsecase: GetReportByIdUsecase;
  private readonly updateReportUsecase: UpdateReportUsecase;
  private readonly getAllReportsUsecase: GetAllReportsUsecase;

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

  async createReport(req: Request, res: Response): Promise<void> {
    const reportData: ReportModel = ReportMapper.toModel(req.body);

    const newReport: Either<ErrorClass, ReportEntity> =
      await this.createReportUsecase.execute(reportData);

    newReport.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 400),
      (result: ReportEntity) => {
        const resData = ReportMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Report created successfully",
          201
        );
      }
    );
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    const reportId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteReportUsecase.execute(reportId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Report deleted successfully",
          204
        );
      }
    );
  }

  async getReportById(req: Request, res: Response): Promise<void> {
    const reportId: string = req.params.id;

    const report: Either<ErrorClass, ReportEntity> =
      await this.getReportByIdUsecase.execute(reportId);

    report.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: ReportEntity) => {
        const resData = ReportMapper.toEntity(result, true);
        this.sendSuccessResponse(res, resData, "Report retrieved successfully");
      }
    );
  }

  async updateReport(req: Request, res: Response): Promise<void> {
    const reportId: string = req.params.id;
    const reportData: ReportModel = req.body;

    const existingReport: Either<ErrorClass, ReportEntity> =
      await this.getReportByIdUsecase.execute(reportId);

    existingReport.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      async (existingReportData: ReportEntity) => {
        const resData = ReportMapper.toEntity(existingReportData, true);

        const updatedReportEntity: ReportEntity = ReportMapper.toEntity(
          reportData,
          true,
          resData
        );

        const updatedReport: Either<ErrorClass, ReportEntity> =
          await this.updateReportUsecase.execute(reportId, updatedReportEntity);

        updatedReport.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error),
          (result: ReportEntity) => {
            const responseData = ReportMapper.toModel(result);
            this.sendSuccessResponse(res, responseData, "Report updated successfully");
          }
        );
      }
    );
  }

  async getAllReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const reports: Either<ErrorClass, ReportEntity[]> =
      await this.getAllReportsUsecase.execute();

    reports.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (reports: ReportEntity[]) => {
        const resData = reports.map((report: any) =>
          ReportMapper.toEntity(report)
        );
        this.sendSuccessResponse(res, resData, "Reports retrieved successfully");
      }
    );
  }
}
