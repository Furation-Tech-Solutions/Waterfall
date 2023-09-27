import { NextFunction, Request, Response } from "express";
import {
  RealtorModel,
  RealtorEntity,
  RealtorMapper,
} from "@domain/realtors/entities/realtors";
import { CreateRealtorUsecase } from "@domain/realtors/usecases/create-realtor";
import { GetAllRealtorsUsecase } from "@domain/realtors/usecases/get-all-realtors";
import { GetRealtorByIdUsecase } from "@domain/realtors/usecases/get-realtor-by-id";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class RealtorService {
  private readonly CreateRealtorUsecase: CreateRealtorUsecase;
  private readonly GetAllRealtorsUsecase: GetAllRealtorsUsecase;
  private readonly GetRealtorByIdUsecase: GetRealtorByIdUsecase;

  constructor(
    CreateRealtorUsecase: CreateRealtorUsecase,
    GetAllRealtorsUsecase: GetAllRealtorsUsecase,
    GetRealtorByIdUsecase: GetRealtorByIdUsecase
  ) {
    this.CreateRealtorUsecase = CreateRealtorUsecase;
    this.GetAllRealtorsUsecase = GetAllRealtorsUsecase;
    this.GetRealtorByIdUsecase = GetRealtorByIdUsecase;
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

  async getAllRealtors(req: Request, res: Response, next: NextFunction): Promise<void> {
      // Call the GetAllRealtorsUsecase to get all Realtors
      const realtors: Either<ErrorClass, RealtorEntity[]> = await this.GetAllRealtorsUsecase.execute();
      
      realtors.cata(
        (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
        (result: RealtorEntity[]) => {
            // Filter out realtors with del_status set to "Deleted"
            const nonDeletedRealtors = result.filter((realtor) => realtor.deleteStatus !== false);

            // Convert non-deleted realtors from an array of RealtorEntity to an array of plain JSON objects using FoodCategoryMapper
            const responseData = nonDeletedRealtors.map((realtor) => RealtorMapper.toEntity(realtor));
            return res.json(responseData);
        }
    );
  }

  async getRealtorById(req: Request, res: Response): Promise<void> {
      const realtorId: string = req.params.realtorId;

      // Call the GetRealtorByIdUsecase to get the realtor by ID
      const realtor: Either<ErrorClass, RealtorEntity | null> = await this.GetRealtorByIdUsecase.execute(
        realtorId
      );

      realtor.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: RealtorEntity | null) =>{
          const responseData = RealtorMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }
}
