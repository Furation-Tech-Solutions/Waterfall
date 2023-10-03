import {
  UpcomingTaskEntity,
  UpcomingTaskModel,
} from "@domain/upcomingTask/entities/upcomingTask";
import { UpcomingTaskRepository } from "@domain/upcomingTask/repositories/upcomingTask-repository";
import { UpcomingTaskDataSource } from "@data/upcomingTask/datasources/upcomingTask-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class UpcomingTaskRepositoryImpl implements UpcomingTaskRepository {
  private readonly dataSource: UpcomingTaskDataSource;

  constructor(dataSource: UpcomingTaskDataSource) {
    this.dataSource = dataSource;
  }

  async createUpcomingTask(
    upcomingTask: UpcomingTaskModel
  ): Promise<Either<ErrorClass, UpcomingTaskEntity>> {
    try {
      const i = await this.dataSource.create(upcomingTask);
      return Right<ErrorClass, UpcomingTaskEntity>(i);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, UpcomingTaskEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, UpcomingTaskEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async updateUpcomingTask(
    id: string,
    data: UpcomingTaskModel
  ): Promise<Either<ErrorClass, UpcomingTaskEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, UpcomingTaskEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, UpcomingTaskEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getUpcomingTasks(): Promise<Either<ErrorClass, UpcomingTaskEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, UpcomingTaskEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, UpcomingTaskEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, UpcomingTaskEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getUpcomingTaskById(
    id: string
  ): Promise<Either<ErrorClass, UpcomingTaskEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, UpcomingTaskEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, UpcomingTaskEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, UpcomingTaskEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
