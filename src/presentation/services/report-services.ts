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

  async createReport(req: Request, res: Response): Promise<void> {
    const reportData: ReportModel = ReportMapper.toModel(req.body);

    const newReport: Either<ErrorClass, ReportEntity> =
      await this.createReportUsecase.execute(reportData);

    newReport.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: ReportEntity) => {
        const resData = ReportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // async deleteReport(req: Request, res: Response): Promise<void> {
  //   const reportId: string = req.params.id;

  //   const response: Either<ErrorClass, void> =
  //     await this.deleteReportUsecase.execute(reportId);

  //   response.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     () => {
  //       return res.json({ message: "Report deleted successfully." });
  //     }
  //   );
  // }

  // async getReportById(req: Request, res: Response): Promise<void> {
  //   const reportId: string = req.params.id;

  //   const report: Either<ErrorClass, ReportEntity> =
  //     await this.getReportByIdUsecase.execute(reportId);

  //   report.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     (result: ReportEntity) => {
  //       const resData = ReportMapper.toEntity(result, true);
  //       return res.json(resData);
  //     }
  //   );
  // }

  // async updateReport(req: Request, res: Response): Promise<void> {
  //   const reportId: string = req.params.id;
  //   const reportData: ReportModel = req.body;

  //   const existingReport: Either<ErrorClass, ReportEntity> =
  //     await this.getReportByIdUsecase.execute(reportId);

  //   existingReport.cata(
  //     (error: ErrorClass) => {
  //       res.status(error.status).json({ error: error.message });
  //     },
  //     async (result: ReportEntity) => {
  //       const resData = ReportMapper.toEntity(result, true);

  //       const updatedReportEntity: ReportEntity = ReportMapper.toEntity(
  //         reportData,
  //         true,
  //         resData
  //       );

  //       const updatedReport: Either<ErrorClass, ReportEntity> =
  //         await this.updateReportUsecase.execute(reportId, updatedReportEntity);

  //       updatedReport.cata(
  //         (error: ErrorClass) => {
  //           res.status(error.status).json({ error: error.message });
  //         },
  //         (response: ReportEntity) => {
  //           const responseData = ReportMapper.toModel(response);

  //           res.json(responseData);
  //         }
  //       );
  //     }
  //   );
  // }

  // async getAllReports(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const reports: Either<ErrorClass, ReportEntity[]> =
  //     await this.getAllReportsUsecase.execute();

  //   reports.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     (reports: ReportEntity[]) => {
  //       const resData = reports.map((report: any) =>
  //         ReportMapper.toEntity(report)
  //       );
  //       return res.json(resData);
  //     }
  //   );
  // }
}
