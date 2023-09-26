import { RealtorModel, RealtorEntity } from "@domain/realtors/entities/realtors";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface RealtorRepository {
  createRealtor(realtor: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>>;
  getRealtors(): Promise<Either<ErrorClass, RealtorEntity[]>>;
}