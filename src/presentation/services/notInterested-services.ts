import { NextFunction, Request, Response } from "express";
import {
  NotInterestedEntity,
  NotInterestedModel,
  NotInterestedMapper,
} from "@domain/notInterested/entities/notInterested_entities";
import { CreateNotInterestedUsecase } from "@domain/notInterested/usecases/create-notInterested";
import { DeleteNotInterestedUsecase } from "@domain/notInterested/usecases/delete-notInterested";
import { GetNotInterestedByIdUsecase } from "@domain/notInterested/usecases/get-notInterested-by-id";
import { UpdateNotInterestedUsecase } from "@domain/notInterested/usecases/update-notInterested";
import { GetAllNotInterestedsUsecase } from "@domain/notInterested/usecases/get-all-notInterested";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class NotInterestedService {
  private readonly createNotInterestedUsecase: CreateNotInterestedUsecase;
  private readonly deleteNotInterestedUsecase: DeleteNotInterestedUsecase;
  private readonly getNotInterestedByIdUsecase: GetNotInterestedByIdUsecase;
  private readonly updateNotInterestedUsecase: UpdateNotInterestedUsecase;
  private readonly getAllNotInterestedsUsecase: GetAllNotInterestedsUsecase;

  constructor(
    createNotInterestedUsecase: CreateNotInterestedUsecase,
    deleteNotInterestedUsecase: DeleteNotInterestedUsecase,
    getNotInterestedByIdUsecase: GetNotInterestedByIdUsecase,
    updateNotInterestedUsecase: UpdateNotInterestedUsecase,
    getAllNotInterestedsUsecase: GetAllNotInterestedsUsecase
  ) {
    this.createNotInterestedUsecase = createNotInterestedUsecase;
    this.deleteNotInterestedUsecase = deleteNotInterestedUsecase;
    this.getNotInterestedByIdUsecase = getNotInterestedByIdUsecase;
    this.updateNotInterestedUsecase = updateNotInterestedUsecase;
    this.getAllNotInterestedsUsecase = getAllNotInterestedsUsecase;
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

  async createNotInterested(req: Request, res: Response): Promise<void> {
    const notInterestedData: NotInterestedModel = NotInterestedMapper.toModel(
      req.body
    );

    const newNotInterested: Either<ErrorClass, NotInterestedEntity> =
      await this.createNotInterestedUsecase.execute(notInterestedData);

    newNotInterested.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: NotInterestedEntity) => {
        const resData = NotInterestedMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "NotInterested Job data created successfully",
          201
        );
      }
    );
  }

  async deleteNotInterested(req: Request, res: Response): Promise<void> {
    const notInterestedId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteNotInterestedUsecase.execute(notInterestedId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "NotInterested Job data deleted successfully",
          204
        );
      }
    );
  }

  async getNotInterestedById(req: Request, res: Response): Promise<void> {
    const notInterestedId: string = req.params.id;

    const notInterested: Either<ErrorClass, NotInterestedEntity> =
      await this.getNotInterestedByIdUsecase.execute(notInterestedId);

    notInterested.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      (result: NotInterestedEntity) => {
        const resData = NotInterestedMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "NotInterested Job data retrieved successfully"
        );
      }
    );
  }

  async updateNotInterested(req: Request, res: Response): Promise<void> {
    const notInterestedId: string = req.params.id;
    const notInterestedData: NotInterestedModel = req.body;

    const existingNotInterested: Either<ErrorClass, NotInterestedEntity> =
      await this.getNotInterestedByIdUsecase.execute(notInterestedId);

    existingNotInterested.cata(
      (error: ErrorClass) => {
        this.sendErrorResponse(res, error, 404);
      },
      async (result: NotInterestedEntity) => {
        const resData = NotInterestedMapper.toEntity(result, true);

        const updatedNotInterestedEntity: NotInterestedEntity =
          NotInterestedMapper.toEntity(notInterestedData, true, resData);

        const updatedNotInterested: Either<ErrorClass, NotInterestedEntity> =
          await this.updateNotInterestedUsecase.execute(
            notInterestedId,
            updatedNotInterestedEntity
          );

        updatedNotInterested.cata(
          (error: ErrorClass) => {
            this.sendErrorResponse(res, error, 500);
          },
          (response: NotInterestedEntity) => {
            const responseData = NotInterestedMapper.toModel(response);
            this.sendSuccessResponse(
              res,
              responseData,
              "NotInterested Job data updated successfully"
            );
          }
        );
      }
    );
  }

  async getAllNotInteresteds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let Id = req.headers.id;
    let Id = req.user;

    // let loginId = req.user;
    // loginId = "1"; // For testing purposes, manually set loginId to "2"
    const query: any = {}; // Create an empty query object

    // Assign values to properties of the query object
    query.id = Id;
    query.page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
    query.limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number

    const notInteresteds: Either<ErrorClass, NotInterestedEntity[]> =
      await this.getAllNotInterestedsUsecase.execute(query);

    notInteresteds.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: NotInterestedEntity[]) => {
        const resData = result.map((notInterested: any) =>
          NotInterestedMapper.toEntity(notInterested)
        );
        this.sendSuccessResponse(res, resData);
      }
    );
  }
}
