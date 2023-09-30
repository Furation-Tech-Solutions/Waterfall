import { JobEntity } from "@domain/job/entites/job";
import { JobRepository } from "@domain/job/repositories/job-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetJobByIdUsecase {
    execute: (jobId: string) => Promise<Either<ErrorClass, JobEntity>>;
}

export class GetJobById implements GetJobByIdUsecase {
    private readonly jobRepository: JobRepository;

    constructor(jobRepository: JobRepository) {
        this.jobRepository = jobRepository;
    }

    async execute(
        jobId: string
    ): Promise<Either<ErrorClass, JobEntity>> {
        return await this.jobRepository.getJobById(jobId);
    }
}
