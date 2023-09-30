import { JobEntity, JobModel } from "@domain/job/entites/job";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface JobRepository {
    createJob(
        job: JobModel
    ): Promise<Either<ErrorClass, JobEntity>>;
    deleteJob(id: string): Promise<Either<ErrorClass, void>>;
    updateJob(
        id: string,
        data: JobModel
    ): Promise<Either<ErrorClass, JobEntity>>;
    getJobs(): Promise<Either<ErrorClass, JobEntity[]>>;
    getJobById(id: string): Promise<Either<ErrorClass, JobEntity>>;
}


