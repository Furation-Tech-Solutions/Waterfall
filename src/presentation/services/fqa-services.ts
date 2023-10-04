import { NextFunction, Request, Response } from "express";
import {
  FQAModel,
  FQAEntity,
  FQAMapper,
} from "@domain/fqa/entities/fqa";
import { CreateFQAUsecase } from "@domain/fqa/usecases/create-fqa";
import { GetAllFQAsUsecase } from "@domain/fqa/usecases/get-all-fqas";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FQAService {
  private readonly CreateFQAUsecase: CreateFQAUsecase;
  private readonly GetAllFQAsUsecase: GetAllFQAsUsecase;

  constructor(
    CreateFQAUsecase: CreateFQAUsecase,
    GetAllFQAsUsecase: GetAllFQAsUsecase
  ) {
    this.CreateFQAUsecase = CreateFQAUsecase;
    this.GetAllFQAsUsecase = GetAllFQAsUsecase;
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

  async getAllFQAs(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Call the GetAllFQAsUsecase to get all FQAs
    const fqas: Either<ErrorClass, FQAEntity[]> = await this.GetAllFQAsUsecase.execute();
      
    fqas.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: FQAEntity[]) => {
          // Filter out fqas with del_status set to "Deleted"
          // const nonDeletedFQAs = result.filter((fqa) => fqa.deleteStatus !== false);

          // Convert non-deleted fqas from an array of FQAEntity to an array of plain JSON objects using fqaMapper
          const responseData = fqas.map((fqa) => FQAMapper.toEntity(fqa));
          return res.json(responseData);
      }
  );
  }
}
