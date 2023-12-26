import { NextFunction, Request, Response } from "express";
import {
  BlockingModel,
  BlockingEntity,
  BlockingMapper,
} from "@domain/blocking/entities/blocking";
import { CreateBlockingUsecase } from "@domain/blocking/usecases/create-blocking";
import { GetAllBlockingsUsecase } from "@domain/blocking/usecases/get-all-blockings";
import { GetBlockingByIdUsecase } from "@domain/blocking/usecases/get-blocking-by-id";
import { UpdateBlockingUsecase } from "@domain/blocking/usecases/update-blocking";
import { DeleteBlockingUsecase } from "@domain/blocking/usecases/delete-blocking";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class BlockingService {
  private readonly CreateBlockingUsecase: CreateBlockingUsecase;
  private readonly GetAllBlockingsUsecase: GetAllBlockingsUsecase;
  private readonly GetBlockingByIdUsecase: GetBlockingByIdUsecase;
  private readonly UpdateBlockingUsecase: UpdateBlockingUsecase;
  private readonly DeleteBlockingUsecase: DeleteBlockingUsecase;

  constructor(
    CreateBlockingUsecase: CreateBlockingUsecase,
    GetAllBlockingsUsecase: GetAllBlockingsUsecase,
    GetBlockingByIdUsecase: GetBlockingByIdUsecase,
    UpdateBlockingUsecase: UpdateBlockingUsecase,
    DeleteBlockingUsecase: DeleteBlockingUsecase
  ) {
    this.CreateBlockingUsecase = CreateBlockingUsecase;
    this.GetAllBlockingsUsecase = GetAllBlockingsUsecase;
    this.GetBlockingByIdUsecase = GetBlockingByIdUsecase;
    this.UpdateBlockingUsecase = UpdateBlockingUsecase;
    this.DeleteBlockingUsecase = DeleteBlockingUsecase;
  }

  private sendSuccessResponse(res: Response, data: any, message: string = "Success", statusCode: number = 200): void {
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

  // Handler for creating a new blocking
  async createBlocking(req: Request, res: Response): Promise<void> {
    const blockingData: BlockingModel = BlockingMapper.toModel(req.body);

    const newBlocking: Either<ErrorClass, BlockingEntity> =
      await this.CreateBlockingUsecase.execute(blockingData);

    newBlocking.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Bad Request
      (result: BlockingEntity) => {
        const resData = BlockingMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Blocking created successfully",
          201
        );
      }
    );
  }

  // Handle for getting all blockings
  async getAllBlockings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // let Id = req.headers.id;
    let Id = req.user;

    // let loginId = req.user;
    // loginId = "3"; // For testing purposes, manually set loginId to "2"

    const query: any = {}; // Create an empty query object

    query.id = Id;
    // Assign values to properties of the query object
    query.page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
    query.limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number

    // Call the GetAllBlockingsUsecase to get all Blockings
    const blockings: Either<ErrorClass, BlockingEntity[]> =
      await this.GetAllBlockingsUsecase.execute(query);
    blockings.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Internal Server Error
      (result: BlockingEntity[]) => {
        const responseData = result.map((blocking) =>
          BlockingMapper.toEntity(blocking)
        );
        this.sendSuccessResponse(res, responseData, "Blockings retrieved successfully");
      }
    );
  }

  // Handler for getting a blocking by ID
  async getBlockingById(req: Request, res: Response): Promise<void> {
    const blockingId: string = req.params.id;

    const blocking: Either<ErrorClass, BlockingEntity> =
      await this.GetBlockingByIdUsecase.execute(blockingId);

    blocking.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: BlockingEntity) => {
        if (!result) {
          this.sendErrorResponse(res, ErrorClass.notFound());
        } else {
          const resData = BlockingMapper.toEntity(result);
          this.sendSuccessResponse(res, resData, "Blocking retrieved successfully");
        }
      }
    );
  }

  // Handler for updating a blocking by ID
  async updateBlocking(req: Request, res: Response): Promise<void> {
    const blockingId: string = req.params.id;
    const blockingData: BlockingModel = req.body;

    const existingBlocking: Either<ErrorClass, BlockingEntity> =
      await this.GetBlockingByIdUsecase.execute(blockingId);

    existingBlocking.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      async (existingBlockingData: BlockingEntity) => {
        const updatedBlockingEntity: BlockingEntity = BlockingMapper.toEntity(
          blockingData,
          true,
          existingBlockingData
        );

        const updatedBlocking: Either<ErrorClass, BlockingEntity> =
          await this.UpdateBlockingUsecase.execute(
            blockingId,
            updatedBlockingEntity
          );

        updatedBlocking.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
          (result: BlockingEntity) => {
            const resData = BlockingMapper.toEntity(result, true);
            this.sendSuccessResponse(res, resData, "Blocking updated successfully");
          }
        );
      }
    );
  }

  // Handler for deleting a blocking by ID
  async deleteBlocking(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    const deleteBlock: Either<ErrorClass, void> =
      await this.DeleteBlockingUsecase.execute(id);

    deleteBlock.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      (result: void) => this.sendSuccessResponse(res, {}, "Blocking deleted successfully", 204), // No Content
    );
  }
}