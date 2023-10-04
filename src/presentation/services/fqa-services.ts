import { NextFunction, Request, Response } from "express";
import {
  FQAModel,
  FQAEntity,
  FQAMapper,
} from "@domain/fqa/entities/fqa";
import { CreateFQAUsecase } from "@domain/fqa/usecases/create-fqa";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FQAService {
  private readonly CreateFQAUsecase: CreateFQAUsecase;

  constructor(
    CreateFQAUsecase: CreateFQAUsecase
  ) {
    this.CreateFQAUsecase = CreateFQAUsecase;
  }

  async createFQA(req: Request, res: Response): Promise<void> {
    const fqaData: FQAModel = FQAMapper.toModel(req.body);
    console.log(fqaData, "service-38");

    const newFQA: Either<ErrorClass, FQAEntity> =
        await this.CreateFQAUsecase.execute(fqaData);

    console.log(fqaData, "service-43");

    newFQA.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: FQAEntity) => {
            const resData = FQAMapper.toEntity(result, true);
            return res.json(resData);
        }
    );
  }
}
