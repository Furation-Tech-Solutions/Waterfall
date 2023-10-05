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
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FeedBackService {
  private readonly CreateFeedBackUsecase: CreateFeedBackUsecase;
  private readonly GetAllFeedBacksUsecase: GetAllFeedBacksUsecase;
  private readonly GetFeedBackByIdUsecase: GetFeedBackByIdUsecase;
  private readonly UpdateFeedBackUsecase: UpdateFeedBackUsecase;

  constructor(
    CreateFeedBackUsecase: CreateFeedBackUsecase,
    GetAllFeedBacksUsecase: GetAllFeedBacksUsecase,
    GetFeedBackByIdUsecase: GetFeedBackByIdUsecase,
    UpdateFeedBackUsecase: UpdateFeedBackUsecase
  ) {
    this.CreateFeedBackUsecase = CreateFeedBackUsecase;
    this.GetAllFeedBacksUsecase = GetAllFeedBacksUsecase;
    this.GetFeedBackByIdUsecase = GetFeedBackByIdUsecase;
    this.UpdateFeedBackUsecase = UpdateFeedBackUsecase;
  }

  async createFeedBack(req: Request, res: Response): Promise<void> {
    const feedBackData: FeedBackModel = FeedBackMapper.toModel(req.body);
    console.log(feedBackData, "service-38");

    const newFeedBack: Either<ErrorClass, FeedBackEntity> =
        await this.CreateFeedBackUsecase.execute(feedBackData);

    console.log(feedBackData, "service-43");

    newFeedBack.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: FeedBackEntity) => {
            const resData = FeedBackMapper.toEntity(result, true);
            return res.json(resData);
        }
    );
  }

  async getAllFeedBacks(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Call the GetAllFeedBacksUsecase to get all FeedBacks
    const feedBacks: Either<ErrorClass, FeedBackEntity[]> = await this.GetAllFeedBacksUsecase.execute();
      
    feedBacks.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: FeedBackEntity[]) => {
          // Filter out feedBacks with del_status set to "Deleted"
          // const nonDeletedFeedBacks = result.filter((feedBack) => feedBack.deleteStatus !== false);

          // Convert non-deleted feedBacks from an array of FeedBackEntity to an array of plain JSON objects using feedBackMapper
          const responseData = feedBacks.map((feedBack) => FeedBackMapper.toEntity(feedBack));
          return res.json(responseData);
      }
  );
  }

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
}
