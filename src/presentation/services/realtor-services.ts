import { NextFunction, Request, Response } from "express";
import {
  RealtorModel,
  RealtorEntity,
  RealtorMapper,
} from "@domain/realtors/entities/realtors";
import { CreateRealtorUsecase } from "@domain/realtors/usecases/create-realtor";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class RealtorService {
  private readonly CreateRealtorUsecase: CreateRealtorUsecase;

  constructor(
    CreateRealtorUsecase: CreateRealtorUsecase,
  ) {
    this.CreateRealtorUsecase = CreateRealtorUsecase;
  }

  async createRealtor(req: Request, res: Response): Promise<void> {
      // Extract Realtor data from the request body and convert it to RealtorModel
      const realtorData: RealtorModel = RealtorMapper.toModel(req.body);

      // Call the CreateRealtorUsecase to create the realtor
      const newRealtor: Either<ErrorClass, RealtorEntity> = await this.CreateRealtorUsecase.execute(
        realtorData
      );

      newRealtor.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: RealtorEntity) =>{
          const responseData = RealtorMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }
}
