import { FQAModel, FQAEntity } from "@domain/fqa/entities/fqa";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface FQARepository {
  createFQA(fqa: FQAModel): Promise<Either<ErrorClass, FQAEntity>>;
  getFQAs(): Promise<Either<ErrorClass, FQAEntity[]>>;
  getFQAById(id: string): Promise<Either<ErrorClass, FQAEntity>>;
}