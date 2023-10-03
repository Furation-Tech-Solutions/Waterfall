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

  async createBlocking(req: Request, res: Response): Promise<void> {
    const blockingData: BlockingModel = BlockingMapper.toModel(req.body);
    console.log(blockingData, "service-38");

    const newBlocking: Either<ErrorClass, BlockingEntity> =
        await this.CreateBlockingUsecase.execute(blockingData);

    console.log(blockingData, "service-43");

    newBlocking.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: BlockingEntity) => {
            const resData = BlockingMapper.toEntity(result, true);
            return res.json(resData);
        }
    );
  }

  async getAllBlockings(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Call the GetAllBlockingsUsecase to get all Blockings
    const blockings: Either<ErrorClass, BlockingEntity[]> = await this.GetAllBlockingsUsecase.execute();
      
    blockings.cata(
      (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
      (result: BlockingEntity[]) => {
          // Filter out blockings with del_status set to "Deleted"
          // const nonDeletedBlockings = result.filter((blocking) => blocking.deleteStatus !== false);

          // Convert non-deleted blockings from an array of BlockingEntity to an array of plain JSON objects using blockingMapper
          const responseData = blockings.map((blocking) => BlockingMapper.toEntity(blocking));
          return res.json(responseData);
      }
  );
  }

  async getBlockingById(req: Request, res: Response): Promise<void> {
    const blockingId: string = req.params.id;

    const blocking: Either<ErrorClass, BlockingEntity> =
        await this.GetBlockingByIdUsecase.execute(blockingId);

    blocking.cata(
        (error: ErrorClass) =>
            res.status(error.status).json({ error: error.message }),
        (result: BlockingEntity) => {
            if (!result) {
                return res.json({ message: "Blocking Name not found." });
            }
            const resData = BlockingMapper.toEntity(result);
            return res.json(resData);
        }
    );
  }

  async updateBlocking(req: Request, res: Response): Promise<void> {
    const blockingId: string = req.params.id;
    const blockingData: BlockingModel = req.body;

    const existingBlocking: Either<ErrorClass, BlockingEntity> =
        await this.GetBlockingByIdUsecase.execute(blockingId);

    existingBlocking.cata(
        (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
        },
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
                (error: ErrorClass) => {
                    res.status(error.status).json({ error: error.message });
                },
                (result: BlockingEntity) => {
                    const resData = BlockingMapper.toEntity(result, true);
                    res.json(resData);
                }
            );
        }
    );
  }

  async deleteBlocking(req: Request, res: Response): Promise<void> {
      const id: string = req.params.id;
    
      // Execute the deleteBlock use case to delete a blocking by ID
      const deleteBlock: Either<ErrorClass, void> 
        = await this.DeleteBlockingUsecase.execute(id);

      deleteBlock.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: void) =>{
          return res.json({ message: "Connection deleted successfully." })
        }
      )
  }
}
