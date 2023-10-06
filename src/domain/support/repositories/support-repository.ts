import { SupportEntity, SupportModel } from "@domain/support/entities/support";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface SupportRepository {
  createSupport(support: SupportModel): Promise<Either<ErrorClass, SupportEntity>>;
  deleteSupport(id: string): Promise<Either<ErrorClass, void>>;
  updateSupport(id: string, data: SupportModel): Promise<Either<ErrorClass, SupportEntity>>;
  getSupports(): Promise<Either<ErrorClass, SupportEntity[]>>;
  getSupportById(id: string): Promise<Either<ErrorClass, SupportEntity>>;
}
