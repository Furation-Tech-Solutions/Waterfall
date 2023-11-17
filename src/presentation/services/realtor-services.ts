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
import { DeleteRealtorUsecase } from "@domain/realtors/usecases/delete-realtor";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class RealtorService {
  private readonly CreateRealtorUsecase: CreateRealtorUsecase;
  private readonly GetAllRealtorsUsecase: GetAllRealtorsUsecase;
  private readonly GetRealtorByIdUsecase: GetRealtorByIdUsecase;
  private readonly UpdateRealtorUsecase: UpdateRealtorUsecase;
  private readonly DeleteRealtorUsecase: DeleteRealtorUsecase;

  constructor(
    CreateRealtorUsecase: CreateRealtorUsecase,
    GetAllRealtorsUsecase: GetAllRealtorsUsecase,
    GetRealtorByIdUsecase: GetRealtorByIdUsecase,
    UpdateRealtorUsecase: UpdateRealtorUsecase,
    DeleteRealtorUsecase: DeleteRealtorUsecase,
  ) {
    this.CreateRealtorUsecase = CreateRealtorUsecase;
    this.GetAllRealtorsUsecase = GetAllRealtorsUsecase;
    this.GetRealtorByIdUsecase = GetRealtorByIdUsecase;
    this.UpdateRealtorUsecase = UpdateRealtorUsecase;
    this.DeleteRealtorUsecase = DeleteRealtorUsecase;
  }

  private sendSuccessResponse(res: Response, data: any, message: string = "Success", statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  private sendErrorResponse(res: Response, error: ErrorClass): void {
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  // Handler for creating a new Realtor
  async createRealtor(req: Request, res: Response): Promise<void> {
    const realtorData: RealtorModel = RealtorMapper.toModel(req.body);

    const newRealtor: Either<ErrorClass, RealtorEntity> =
      await this.CreateRealtorUsecase.execute(realtorData);

    newRealtor.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: RealtorEntity) => {
        const resData = RealtorMapper.toEntity(result, true);
        this.sendSuccessResponse(res, resData, "Realtor created successfully", 201);
      }
    );
  }

  // Handler for getting all Realtors
  async getAllRealtors(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query: any = {}; // Create an empty query object
    query.page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
    query.limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number
    query.q = req.query.q as string;

    const realtors: Either<ErrorClass, RealtorEntity[]> =
      await this.GetAllRealtorsUsecase.execute(query);

    realtors.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: RealtorEntity[]) => this.sendSuccessResponse(res, result, "Realtors retrieved successfully")
    );
  }

  // Handler for getting Realtor by ID  
  async getRealtorById(req: Request, res: Response): Promise<void> {
    const realtorId: string = req.params.id;

    const realtor: Either<ErrorClass, RealtorEntity> =
      await this.GetRealtorByIdUsecase.execute(realtorId);

    realtor.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: RealtorEntity) => {
        if (!result) {
          this.sendErrorResponse(res, ErrorClass.notFound());
        } else {
          const resData = RealtorMapper.toEntity(result);
          this.sendSuccessResponse(res, resData, "Realtor retrieved successfully");
        }
      }
    );
  }

  // Handler for updating Realtor by ID
  async updateRealtor(req: Request, res: Response): Promise<void> {
    const realtorId: string = req.params.id;
    const realtorData: RealtorModel = req.body;

    const existingRealtor: Either<ErrorClass, RealtorEntity> =
      await this.GetRealtorByIdUsecase.execute(realtorId);

    existingRealtor.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      async (existingRealtorData: RealtorEntity) => {
        const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
          realtorData,
          true,
          existingRealtorData
        );

        const updatedRealtor: Either<ErrorClass, RealtorEntity> =
          await this.UpdateRealtorUsecase.execute(
            realtorId,
            updatedRealtorEntity
          );

        updatedRealtor.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error),
          (result: RealtorEntity) => {
            const resData = RealtorMapper.toEntity(result, true);
            this.sendSuccessResponse(res, resData, "Realtor updated successfully");
          }
        );
      }
    );
  }

  // Handler for deleting Realtor by ID
  async deleteRealtor(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
      { deleteStatus: true },
      true
    );

    // Call the UpdateRealtorUsecase to update the Realtor
    const updatedRealtor: Either<ErrorClass, RealtorEntity> = await this.UpdateRealtorUsecase.execute(
      id,
      updatedRealtorEntity
    );

    updatedRealtor.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: RealtorEntity) => {
        const responseData = RealtorMapper.toModel(result);
        this.sendSuccessResponse(res, responseData, "Realtor deleted successfully");
      }
    );
  }
}
