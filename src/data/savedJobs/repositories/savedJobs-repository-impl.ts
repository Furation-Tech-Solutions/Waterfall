import { SavedJobEntity, SavedJobModel } from "@domain/savedJobs/entities/savedJobs";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { SavedJobDataSource } from "@data/savedJobs/datasources/savedJobs-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class SavedJobRepositoryImpl implements SavedJobRepository {
  private readonly dataSource: SavedJobDataSource;

  constructor(dataSource: SavedJobDataSource) {
    this.dataSource = dataSource;
  }

  async createSavedJob(savedJob: SavedJobModel): Promise<Either<ErrorClass, SavedJobEntity>> {
    try {
      const i = await this.dataSource.create(savedJob);
      return Right<ErrorClass, SavedJobEntity>(i);
    } catch (error: any) {
      console.log(error);

      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, SavedJobEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async deleteSavedJob(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  async updateSavedJob(
    id: string,
    data: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, SavedJobEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getSavedJobs(): Promise<Either<ErrorClass, SavedJobEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, SavedJobEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, SavedJobEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, SavedJobEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getSavedJobById(id: string): Promise<Either<ErrorClass, SavedJobEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, SavedJobEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, SavedJobEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
