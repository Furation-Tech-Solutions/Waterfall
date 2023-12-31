import { NextFunction, Request, Response } from "express";
import {
  SupportEntity,
  SupportModel,
  SupportMapper,
} from "@domain/support/entities/support";
import { CreateSupportUsecase } from "@domain/support/usecases/create-support";
import { DeleteSupportUsecase } from "@domain/support/usecases/delete-support";
import { GetSupportByIdUsecase } from "@domain/support/usecases/get-support-by-id";
import { UpdateSupportUsecase } from "@domain/support/usecases/update-support";
import { GetAllSupportsUsecase } from "@domain/support/usecases/get-all-supports";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class SupportService {
  private readonly createSupportUsecase: CreateSupportUsecase;
  private readonly deleteSupportUsecase: DeleteSupportUsecase;
  private readonly getSupportByIdUsecase: GetSupportByIdUsecase;
  private readonly updateSupportUsecase: UpdateSupportUsecase;
  private readonly getAllSupportsUsecase: GetAllSupportsUsecase;

  constructor(
    createSupportUsecase: CreateSupportUsecase,
    deleteSupportUsecase: DeleteSupportUsecase,
    getSupportByIdUsecase: GetSupportByIdUsecase,
    updateSupportUsecase: UpdateSupportUsecase,
    getAllSupportsUsecase: GetAllSupportsUsecase
  ) {
    this.createSupportUsecase = createSupportUsecase;
    this.deleteSupportUsecase = deleteSupportUsecase;
    this.getSupportByIdUsecase = getSupportByIdUsecase;
    this.updateSupportUsecase = updateSupportUsecase;
    this.getAllSupportsUsecase = getAllSupportsUsecase;
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

  async createSupport(req: Request, res: Response): Promise<void> {
    const supportData: SupportModel = SupportMapper.toModel(req.body);

    const newSupport: Either<ErrorClass, SupportEntity> =
      await this.createSupportUsecase.execute(supportData);

    newSupport.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Support created successfully",
          201
        );
      }
    );
  }

  async deleteSupport(req: Request, res: Response): Promise<void> {
    const supportId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteSupportUsecase.execute(supportId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Saved job deleted successfully",
          204
        );
      }
    );
  }

  async getSupportById(req: Request, res: Response): Promise<void> {
    const supportId: string = req.params.id;

    const support: Either<ErrorClass, SupportEntity> =
      await this.getSupportByIdUsecase.execute(supportId);

    support.cata(
      (error: ErrorClass) => {
        if (error.message === "not found") {
          // Send success response with status code 200
          this.sendSuccessResponse(res, [], "Support not found", 200);
        } else {
          this.sendErrorResponse(res, error, 404);
        }
      },
      (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Support retrieved successfully"
        );
      }
    );
  }

  async updateSupport(req: Request, res: Response): Promise<void> {
    const supportId: string = req.params.id;
    const supportData: SupportModel = req.body;

    const existingSupport: Either<ErrorClass, SupportEntity> =
      await this.getSupportByIdUsecase.execute(supportId);

    existingSupport.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      async (result: SupportEntity) => {
        const resData = SupportMapper.toEntity(result, true);

        const updatedSupportEntity: SupportEntity = SupportMapper.toEntity(
          supportData,
          true,
          resData
        );

        const updatedSupport: Either<ErrorClass, SupportEntity> =
          await this.updateSupportUsecase.execute(supportId, updatedSupportEntity);

        updatedSupport.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: SupportEntity) => {
            const responseData = SupportMapper.toModel(response);
            this.sendSuccessResponse(res, responseData, "Support updated successfully");
          }
        );
      }
    );
  }

  async getAllSupports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const supports: Either<ErrorClass, SupportEntity[]> =
      await this.getAllSupportsUsecase.execute();

    supports.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (supports: SupportEntity[]) => {
         if (supports.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
        const resData = supports.map((support: any) =>
          SupportMapper.toEntity(support)
        );
        this.sendSuccessResponse(
          res,
          resData,
          "Supports retrieved successfully"
        );
        }
      }
    );
  }
}
