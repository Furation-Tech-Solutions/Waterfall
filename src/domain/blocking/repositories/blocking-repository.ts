import { BlockingModel, BlockingEntity } from "@domain/blocking/entities/blocking";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface BlockingRepository {
  createBlocking(blocking: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>>;
  getBlockings(): Promise<Either<ErrorClass, BlockingEntity[]>>;
  getBlockingById(id: string): Promise<Either<ErrorClass, BlockingEntity>>;
  updateBlocking(id: string, data: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>>;
  deleteBlocking(id: string): Promise<Either<ErrorClass, void>>;
}