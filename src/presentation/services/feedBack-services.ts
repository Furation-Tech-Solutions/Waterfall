import { NextFunction, Request, Response } from "express";
import {
  FeedBackModel,
  FeedBackEntity,
  FeedBackMapper,
} from "@domain/feedBack/entities/feedBack";
import { CreateFeedBackUsecase } from "@domain/feedBack/usecases/create-feedBack";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FeedBackService {
  private readonly CreateFeedBackUsecase: CreateFeedBackUsecase;

  constructor(
    CreateFeedBackUsecase: CreateFeedBackUsecase
  ) {
    this.CreateFeedBackUsecase = CreateFeedBackUsecase;
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
}
