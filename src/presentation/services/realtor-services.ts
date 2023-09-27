import { NextFunction, Request, Response } from "express";
import {
  RealtorModel,
  RealtorEntity,
  RealtorMapper,
} from "@domain/realtors/entities/realtors";
import { CreateRealtorUsecase } from "@domain/realtors/usecases/create-realtor";
import { GetAllRealtorsUsecase } from "@domain/realtors/usecases/get-all-realtors";
import { GetRealtorByIdUsecase } from "@domain/realtors/usecases/get-realtor-by-id";
import { UpdateRealtorUsecase } from "@domain/realtors/usecases/update-realtor";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class RealtorService {
  private readonly CreateRealtorUsecase: CreateRealtorUsecase;
  private readonly GetAllRealtorsUsecase: GetAllRealtorsUsecase;
  private readonly GetRealtorByIdUsecase: GetRealtorByIdUsecase;
  private readonly UpdateRealtorUsecase: UpdateRealtorUsecase;

  constructor(
    CreateRealtorUsecase: CreateRealtorUsecase,
    GetAllRealtorsUsecase: GetAllRealtorsUsecase,
    GetRealtorByIdUsecase: GetRealtorByIdUsecase,
    UpdateRealtorUsecase: UpdateRealtorUsecase
  ) {
    this.CreateRealtorUsecase = CreateRealtorUsecase;
    this.GetAllRealtorsUsecase = GetAllRealtorsUsecase;
    this.GetRealtorByIdUsecase = GetRealtorByIdUsecase;
    this.UpdateRealtorUsecase = UpdateRealtorUsecase;
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

  async updateRealtor(req: Request, res: Response): Promise<void> {
      const realtorId: string = req.params.realtorId;
      const realtorData: RealtorModel = req.body;

      // Get the existing realtor by ID
      const existingRealtor: Either<ErrorClass, RealtorEntity | null> =
        await this.GetRealtorByIdUsecase.execute(realtorId);

      if (!existingRealtor) {
        // If realtor is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }

      // Convert realtorData from RealtorModel to RealtorEntity using RealtorMapper
      const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
        realtorData,
        true
      );

      // Call the UpdateRealtorUsecase to update the Realtor
      const updatedRealtor: Either<ErrorClass, RealtorEntity> = await this.UpdateRealtorUsecase.execute(
        realtorId,
        updatedRealtorEntity
      );

      updatedRealtor.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: RealtorEntity) =>{
          const responseData = RealtorMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }
}
