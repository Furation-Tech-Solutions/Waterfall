import { JobEntity, JobModel } from "@domain/job/entities/job";
import { JobRepository } from "@domain/job/repositories/job-repository";
import { JobDataSource } from "@data/job/datasources/job-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class JobRepositoryImpl implements JobRepository {
  private readonly dataSource: JobDataSource;

  constructor(dataSource: JobDataSource) {
    this.dataSource = dataSource;
  }

  async createJob(job: JobModel): Promise<Either<ErrorClass, JobEntity>> {
    try {
      const i = await this.dataSource.create(job);
      return Right<ErrorClass, JobEntity>(i);
    } catch (error: any) {
      console.log(error);

      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, JobEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, JobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async deleteJob(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  async updateJob(
    id: string,
    data: JobModel
  ): Promise<Either<ErrorClass, JobEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, JobEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, JobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getJobs(): Promise<Either<ErrorClass, JobEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, JobEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, JobEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, JobEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getJobById(id: string): Promise<Either<ErrorClass, JobEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, JobEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, JobEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, JobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
