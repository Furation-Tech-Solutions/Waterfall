import { JobEntity, JobModel } from "@domain/job/entites/job";
import { JobRepository } from "@domain/job/repositories/job-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateJobUsecase {
    execute: (
        jobData: JobModel
    ) => Promise<Either<ErrorClass, JobEntity>>;
}

export class CreateJob implements CreateJobUsecase {
    private readonly jobRepository: JobRepository;

    constructor(jobRepository: JobRepository) {
        this.jobRepository = jobRepository;
    }

    async execute(
        jobData: JobModel
    ): Promise<Either<ErrorClass, JobEntity>> {
        return await this.jobRepository.createJob(jobData);
    }
}
