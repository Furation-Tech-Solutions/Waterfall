import {
    JobApplicantEntity,
    JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants";
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository";
import { JobApplicantDataSource } from "@data/jobApplicants/datasources/jobApplicants-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";

export class JobApplicantRepositoryImpl implements JobApplicantRepository {
    private readonly dataSource: JobApplicantDataSource;

    constructor(dataSource: JobApplicantDataSource) {
        this.dataSource = dataSource;
    }

    async createJobApplicant(
        jobApplicant: JobApplicantModel
    ): Promise<Either<ErrorClass, JobApplicantEntity>> {
        try {
            const i = await this.dataSource.create(jobApplicant);
            return Right<ErrorClass, JobApplicantEntity>(i);
        } catch (error) {

            if (error instanceof ApiError && error.status === 401) {
                return Left<ErrorClass, JobApplicantEntity>(ApiError.unAuthorized());
            }
            return Left<ErrorClass, JobApplicantEntity>(ApiError.badRequest());
        }
    }


    async updateJobApplicant(
        id: string,
        data: JobApplicantModel
    ): Promise<Either<ErrorClass, JobApplicantEntity>> {
        try {


            const response = await this.dataSource.update(id, data);
            return Right<ErrorClass, JobApplicantEntity>(response);
        } catch (error) {
            return Left<ErrorClass, JobApplicantEntity>(ApiError.badRequest());
        }
    }

    async getJobApplicants(): Promise<Either<ErrorClass, JobApplicantEntity[]>> {
        try {
            const response = await this.dataSource.getAll();
            return Right<ErrorClass, JobApplicantEntity[]>(response);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                return Left<ErrorClass, JobApplicantEntity[]>(ApiError.notFound());
            }
            return Left<ErrorClass, JobApplicantEntity[]>(ApiError.badRequest());
        }
    }

    async getJobApplicantById(
        id: string
    ): Promise<Either<ErrorClass, JobApplicantEntity>> {
        try {
            const response = await this.dataSource.read(id);
            if (response === null) {
                return Left<ErrorClass, JobApplicantEntity>(ApiError.notFound());
            }
            return Right<ErrorClass, JobApplicantEntity>(response);
        } catch (error) {
            return Left<ErrorClass, JobApplicantEntity>(ApiError.badRequest());
        }
    }
}
