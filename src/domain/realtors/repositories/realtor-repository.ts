import { RealtorModel, RealtorEntity } from "@domain/realtors/entities/realtors";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface RealtorRepository {
  createRealtor(realtor: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>>;
  getRealtors(): Promise<Either<ErrorClass, RealtorEntity[]>>;
  getRealtorById(id: string): Promise<Either<ErrorClass, RealtorEntity | null>>;
  updateRealtor(id: string, data: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>>;
  deleteRealtor(id: string): Promise<Either<ErrorClass, void>>;
}