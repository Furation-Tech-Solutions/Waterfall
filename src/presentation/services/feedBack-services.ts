import { NextFunction, Request, Response } from "express";
import {
  FeedBackModel,
  FeedBackEntity,
  FeedBackMapper,
} from "@domain/feedBack/entities/feedBack";
import { CreateFeedBackUsecase } from "@domain/feedBack/usecases/create-feedBack";
import { GetAllFeedBacksUsecase } from "@domain/feedBack/usecases/get-all-feedBacks";
import { GetFeedBackByIdUsecase } from "@domain/feedBack/usecases/get-feedBack-by-id";
import { UpdateFeedBackUsecase } from "@domain/feedBack/usecases/update-feedBack";
import { DeleteFeedBackUsecase } from "@domain/feedBack/usecases/delete-feedBack";
import { GetFeedbackCountUsecase } from "@domain/feedBack/usecases/get-all-feedBacks-Count";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FeedBackService {
  private readonly CreateFeedBackUsecase: CreateFeedBackUsecase;
  private readonly GetAllFeedBacksUsecase: GetAllFeedBacksUsecase;
  private readonly GetFeedBackByIdUsecase: GetFeedBackByIdUsecase;
  private readonly UpdateFeedBackUsecase: UpdateFeedBackUsecase;
  private readonly DeleteFeedBackUsecase: DeleteFeedBackUsecase;
  private readonly GetFeedbackCountUsecase: GetFeedbackCountUsecase;

  constructor(
    CreateFeedBackUsecase: CreateFeedBackUsecase,
    GetAllFeedBacksUsecase: GetAllFeedBacksUsecase,
    GetFeedBackByIdUsecase: GetFeedBackByIdUsecase,
    UpdateFeedBackUsecase: UpdateFeedBackUsecase,
    DeleteFeedBackUsecase: DeleteFeedBackUsecase,
    GetFeedbackCountUsecase: GetFeedbackCountUsecase,
  ) {
    this.CreateFeedBackUsecase = CreateFeedBackUsecase;
    this.GetAllFeedBacksUsecase = GetAllFeedBacksUsecase;
    this.GetFeedBackByIdUsecase = GetFeedBackByIdUsecase;
    this.UpdateFeedBackUsecase = UpdateFeedBackUsecase;
    this.DeleteFeedBackUsecase = DeleteFeedBackUsecase;
    this.GetFeedbackCountUsecase = GetFeedbackCountUsecase;
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

  // Handler for creating a new feedback
  async createFeedBack(req: Request, res: Response): Promise<void> {
    const feedBackData: FeedBackModel = FeedBackMapper.toModel(req.body);

    const newFeedBack: Either<ErrorClass, FeedBackEntity> =
      await this.CreateFeedBackUsecase.execute(feedBackData);

    newFeedBack.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 400), // Bad Request
      (result: FeedBackEntity) => {
        const resData = FeedBackMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Feedback created successfully",
          201
        ); // Created
      }
    );
  }

  // Handler for getting all feedbacks
  async getAllFeedBacks(req: Request, res: Response, next: NextFunction): Promise<void> {
    // let id: string = req.body.loginId;
    // let loginId = id || "1"; // For testing purposes, manually set loginId to "2"
    // let Id = req.headers.id;
    let Id = req.user;


    const query: any = {}; // Create an empty query object

    // Assign values to properties of the query object
    query.id = Id;
    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.year = parseInt(req.query.year as string, 10);
    query.months = parseInt(req.query.months as string, 10);

    // Call the GetAllFeedBacksUsecase to get all Feedbacks
    const feedBacks: Either<ErrorClass, FeedBackEntity[]> =
      await this.GetAllFeedBacksUsecase.execute(query);

    feedBacks.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
      (result: FeedBackEntity[]) => {
        const responseData = result.map((feedback) =>
          FeedBackMapper.toEntity(feedback)
        );
        this.sendSuccessResponse(
          res,
          responseData,
          "Feedbacks retrieved successfully"
        );
      }
    );
  }

  // Handler for getting feedback by ID
  async getFeedBackById(req: Request, res: Response): Promise<void> {
    const feedBackId: string = req.params.id;

    const feedBack: Either<ErrorClass, FeedBackEntity> =
      await this.GetFeedBackByIdUsecase.execute(feedBackId);

    feedBack.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      (result: FeedBackEntity) => {
        if (!result) {
          this.sendErrorResponse(res, ErrorClass.notFound());
        } else {
          const resData = FeedBackMapper.toEntity(result);
          this.sendSuccessResponse(
            res,
            resData,
            "Feedback retrieved successfully"
          );
        }
      }
    );
  }

  // Handler for updating feedback by ID
  async updateFeedBack(req: Request, res: Response): Promise<void> {
    const feedBackId: string = req.params.id;
    const feedBackData: FeedBackModel = req.body;

    const existingFeedBack: Either<ErrorClass, FeedBackEntity> =
      await this.GetFeedBackByIdUsecase.execute(feedBackId);

    existingFeedBack.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      async (existingFeedBackData: FeedBackEntity) => {
        const resData = FeedBackMapper.toEntity(existingFeedBackData, true);

        const updatedFeedBackEntity: FeedBackEntity = FeedBackMapper.toEntity(
          feedBackData,
          true,
          resData
        );

        const updatedFeedBack: Either<ErrorClass, FeedBackEntity> =
          await this.UpdateFeedBackUsecase.execute(
            feedBackId,
            updatedFeedBackEntity
          );

        updatedFeedBack.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
          (result: FeedBackEntity) => {
            const resData = FeedBackMapper.toEntity(result, true);
            this.sendSuccessResponse(
              res,
              resData,
              "Feedback updated successfully"
            );
          }
        );
      }
    );
  }

  // Handler for deleting feedback by ID
  async deleteFeedBack(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    const deleteFeedBack: Either<ErrorClass, void> =
      await this.DeleteFeedBackUsecase.execute(id);

    deleteFeedBack.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Feedback deleted successfully",
          204
        ); // No Content
      }
    );
  }

  async getFeedbackCount(req: Request, res: Response): Promise<void> {
    let id: string = req.body.loginId;
    let loginId = id || "1"; // For testing purposes, manually set loginId to "2"

    const query: any = {}; // Create an empty query object

    // Assign values to properties of the query object
    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    query.id = parseInt(loginId, 10);
    query.year = parseInt(req.query.year as string, 10);
    query.month = parseInt(req.query.month as string, 10);

    const count: Either<ErrorClass, number> =
      await this.GetFeedbackCountUsecase.execute(query);
    count.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
      (result: number) => {
        this.sendSuccessResponse(res, { count: result });
      }
    );
  }
}
