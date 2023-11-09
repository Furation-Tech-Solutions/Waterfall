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

  // Handler for creating a new feedback
  async createFeedBack(req: Request, res: Response): Promise<void> {
    const feedBackData: FeedBackModel = FeedBackMapper.toModel(req.body);

    const newFeedBack: Either<ErrorClass, FeedBackEntity> =
      await this.CreateFeedBackUsecase.execute(feedBackData);

    newFeedBack.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: FeedBackEntity) => {
        const resData = FeedBackMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Handler for getting all feedbacks
  async getAllFeedBacks(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    // Call the GetAllFeedBacksUsecase to get all Feedbacks
    const feedBacks: Either<ErrorClass, FeedBackEntity[]> =
      await this.GetAllFeedBacksUsecase.execute(query);

    feedBacks.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: FeedBackEntity[]) => {
        // Filter out feedbacks with del_status set to "Deleted"
        // const nonDeletedFeedBacks = result.filter((feedback) => feedback.deleteStatus !== false);

        // Convert non-deleted feedbacks from an array of FeedBackEntity to an array of plain JSON objects using feedbackMapper
        const responseData = result.map((feedback) =>
          FeedBackMapper.toEntity(feedback)
        );
        return res.json(responseData);
      }
    );
  }

  // Handler for getting feedback by ID
  async getFeedBackById(req: Request, res: Response): Promise<void> {
    const feedBackId: string = req.params.id;

    const feedBack: Either<ErrorClass, FeedBackEntity> =
      await this.GetFeedBackByIdUsecase.execute(feedBackId);

    feedBack.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: FeedBackEntity) => {
        if (!result) {
          return res.json({ message: "FeedBack Name not found." });
        }
        const resData = FeedBackMapper.toEntity(result);
        return res.json(resData);
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
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (existingFeedBackData: FeedBackEntity) => {
        const updatedFeedBackEntity: FeedBackEntity = FeedBackMapper.toEntity(
          feedBackData,
          true,
          existingFeedBackData
        );

        const updatedFeedBack: Either<ErrorClass, FeedBackEntity> =
          await this.UpdateFeedBackUsecase.execute(
            feedBackId,
            updatedFeedBackEntity
          );

        updatedFeedBack.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (result: FeedBackEntity) => {
            const resData = FeedBackMapper.toEntity(result, true);
            res.json(resData);
          }
        );
      }
    );
  }

  // Handler for deleting feedback by ID
  async deleteFeedBack(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    // Execute the deleteFeedBack use case to delete a feedback by ID
    const deleteFeedBack: Either<ErrorClass, void>
      = await this.DeleteFeedBackUsecase.execute(id);

    deleteFeedBack.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: void) => {
        return res.json({ message: "FeedBack deleted successfully." })
      }
    )
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

    const count: Either<ErrorClass, number> = await this.GetFeedbackCountUsecase.execute(query);
    count.cata(
      (error: ErrorClass) =>

        res.status(error.status).json({ error: error.message }),
      (result: number) => {
        return res.json({ count: result });
      }
    )
  }


}
