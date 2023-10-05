import { NextFunction, Request, Response } from "express";
import { BugReportEntity, BugReportModel, BugReportMapper } from "@domain/bugReport/entities/bugReport";
import { CreateBugReportUsecase } from "@domain/bugReport/usecases/create-bugReport";
import { DeleteBugReportUsecase } from "@domain/bugReport/usecases/delete-bugReport";
import { GetBugReportByIdUsecase } from "@domain/bugReport/usecases/get-bugReport-by-id";
import { UpdateBugReportUsecase } from "@domain/bugReport/usecases/update-bugReport";
import { GetAllBugReportsUsecase } from "@domain/bugReport/usecases/get-all-bugReports";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class BugReportService {
  private readonly createBugReportUsecase: CreateBugReportUsecase;
  private readonly deleteBugReportUsecase: DeleteBugReportUsecase;
  private readonly getBugReportByIdUsecase: GetBugReportByIdUsecase;
  private readonly updateBugReportUsecase: UpdateBugReportUsecase;
  private readonly getAllBugReportsUsecase: GetAllBugReportsUsecase;

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

  async createBugReport(req: Request, res: Response): Promise<void> {
    const bugReportData: BugReportModel = BugReportMapper.toModel(req.body);

    const newBugReport: Either<ErrorClass, BugReportEntity> =
      await this.createBugReportUsecase.execute(bugReportData);

    newBugReport.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: BugReportEntity) => {
        const resData = BugReportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async deleteBugReport(req: Request, res: Response): Promise<void> {
    const bugReportId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteBugReportUsecase.execute(bugReportId);

    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "BugReport deleted successfully." });
      }
    );
  }

  async getBugReportById(req: Request, res: Response): Promise<void> {
    const bugReportId: string = req.params.id;

    const bugReport: Either<ErrorClass, BugReportEntity> =
      await this.getBugReportByIdUsecase.execute(bugReportId);

    bugReport.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: BugReportEntity) => {
        const resData = BugReportMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async updateBugReport(req: Request, res: Response): Promise<void> {
    const bugReportId: string = req.params.id;
    const bugReportData: BugReportModel = req.body;

    const existingBugReport: Either<ErrorClass, BugReportEntity> =
      await this.getBugReportByIdUsecase.execute(bugReportId);

    existingBugReport.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: BugReportEntity) => {
        const resData = BugReportMapper.toEntity(result, true);

        const updatedBugReportEntity: BugReportEntity = BugReportMapper.toEntity(
          bugReportData,
          true,
          resData
        );

        const updatedBugReport: Either<ErrorClass, BugReportEntity> =
          await this.updateBugReportUsecase.execute(bugReportId, updatedBugReportEntity);

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

  // async getAllBugReports(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const bugReports: Either<ErrorClass, BugReportEntity[]> =
  //     await this.getAllBugReportsUsecase.execute();

  //   bugReports.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     (bugReports: BugReportEntity[]) => {
  //       const resData = bugReports.map((bugReport: any) => BugReportMapper.toEntity(bugReport));
  //       return res.json(resData);
  //     }
  //   );
  // }
}
