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
import { NotificationSender } from "./notification-services";

export class RealtorService {
  private readonly createRealtorUsecase: CreateRealtorUsecase;
  private readonly getAllRealtorsUsecase: GetAllRealtorsUsecase;
  private readonly getRealtorByIdUsecase: GetRealtorByIdUsecase;
  private readonly updateRealtorUsecase: UpdateRealtorUsecase;
  private readonly deleteRealtorUsecase: DeleteRealtorUsecase;

  constructor(
    createRealtorUsecase: CreateRealtorUsecase,
    getAllRealtorsUsecase: GetAllRealtorsUsecase,
    getRealtorByIdUsecase: GetRealtorByIdUsecase,
    updateRealtorUsecase: UpdateRealtorUsecase,
    deleteRealtorUsecase: DeleteRealtorUsecase,
  ) {
    this.createRealtorUsecase = createRealtorUsecase;
    this.getAllRealtorsUsecase = getAllRealtorsUsecase;
    this.getRealtorByIdUsecase = getRealtorByIdUsecase;
    this.updateRealtorUsecase = updateRealtorUsecase;
    this.deleteRealtorUsecase = deleteRealtorUsecase;
  }

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

  private sendErrorResponse(res: Response, error: ErrorClass, statusCode: number = 500): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  async createRealtor(req: Request, res: Response): Promise<void> {
    const realtorData: RealtorModel = RealtorMapper.toModel(req.body);
    const newRealtor: Either<ErrorClass, RealtorEntity> =
      await this.createRealtorUsecase.execute(realtorData);
    newRealtor.cata(
      (error: ErrorClass) => {
        this.sendErrorResponse(res, error, 400)
      },
      (result: RealtorEntity) => {
        const resData = RealtorMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Realtor created successfully",
          201
        );
      }
    );
  }

  async getAllRealtors(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query: any = {}; // Create an empty query object
    query.page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
    query.limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number
    query.location = req.query.location as string;
    query.gender = req.query.gender as string;
    query.q = req.query.q as string;

    const realtors: Either<ErrorClass, RealtorEntity[]> =
      await this.getAllRealtorsUsecase.execute(query);

    realtors.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: RealtorEntity[]) =>
        this.sendSuccessResponse(res, result, "Realtors retrieved successfully")
    );
    const notification=new NotificationSender()
    notification.customNotification()
  }

  async getRealtorById(req: Request, res: Response): Promise<void> {
    const realtorId: string = req.params.id;

    const realtor: Either<ErrorClass, RealtorEntity> =
      await this.getRealtorByIdUsecase.execute(realtorId);

    realtor.cata(
      (error: ErrorClass) =>{
         this.sendErrorResponse(res, error,error.status)
      },
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

  async updateRealtor(req: Request, res: Response): Promise<void> {
    const realtorId: string = req.params.id;
    const realtorData: RealtorModel = req.body;

    const existingRealtor: Either<ErrorClass, RealtorEntity> =
      await this.getRealtorByIdUsecase.execute(realtorId);

    existingRealtor.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      async (existingRealtorData: RealtorEntity) => {
        const updatedRealtorEntity: RealtorEntity = RealtorMapper.toEntity(
          realtorData,
          true,
          existingRealtorData
        );

        const updatedRealtor: Either<ErrorClass, RealtorEntity> =
          await this.updateRealtorUsecase.execute(
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

  async deleteRealtor(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    const deletedRealtors: Either<ErrorClass, void> =
      await this.deleteRealtorUsecase.execute(id);

    deletedRealtors.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Realtor deleted successfully",
          204
        ); // No Content
      }
    );
  }
}
