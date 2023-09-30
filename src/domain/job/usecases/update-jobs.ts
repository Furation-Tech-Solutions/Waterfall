import { JobEntity, JobModel } from "@domain/job/entites/job";
import { JobRepository } from "@domain/job/repositories/job-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
export interface UpdateJobUsecase {
    execute: (
        jobId: string,
        jobData: JobModel
    ) => Promise<Either<ErrorClass, JobEntity>>;
}

export class UpdateJob implements UpdateJobUsecase {
    private readonly jobRepository: JobRepository;

    constructor(jobRepository: JobRepository) {
        this.jobRepository = jobRepository;
    }

    async execute(
        jobId: string,
        jobData: JobModel
    ): Promise<Either<ErrorClass, JobEntity>> {
        return await this.jobRepository.updateJob(
            jobId,
            jobData
        );
    }
}
