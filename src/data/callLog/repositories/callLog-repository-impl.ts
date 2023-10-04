import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { CallLogDataSource } from "@data/callLog/datasources/callLog-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class CallLogRepositoryImpl implements CallLogRepository {
  private readonly dataSource: CallLogDataSource;

  constructor(dataSource: CallLogDataSource) {
    this.dataSource = dataSource;
  }

  async createCallLog(
    callLog: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    try {
      const i = await this.dataSource.create(callLog);
      return Right<ErrorClass, CallLogEntity>(i);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, CallLogEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, CallLogEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async deleteCallLog(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  async updateCallLog(
    id: string,
    data: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, CallLogEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, CallLogEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getCallLogs(): Promise<Either<ErrorClass, CallLogEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, CallLogEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, CallLogEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, CallLogEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getCallLogById(id: string): Promise<Either<ErrorClass, CallLogEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, CallLogEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, CallLogEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, CallLogEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
