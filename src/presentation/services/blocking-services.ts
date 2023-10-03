import { NextFunction, Request, Response } from "express";
import {
  BlockingModel,
  BlockingEntity,
  BlockingMapper,
} from "@domain/blocking/entities/blocking";
import { CreateBlockingUsecase } from "@domain/blocking/usecases/create-blocking";
import { GetAllBlockingsUsecase } from "@domain/blocking/usecases/get-all-blockings";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class BlockingService {
  private readonly CreateBlockingUsecase: CreateBlockingUsecase;
  private readonly GetAllBlockingsUsecase: GetAllBlockingsUsecase;

  constructor(
    CreateBlockingUsecase: CreateBlockingUsecase,
    GetAllBlockingsUsecase: GetAllBlockingsUsecase
  ) {
    this.CreateBlockingUsecase = CreateBlockingUsecase;
    this.GetAllBlockingsUsecase = GetAllBlockingsUsecase;
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
}
