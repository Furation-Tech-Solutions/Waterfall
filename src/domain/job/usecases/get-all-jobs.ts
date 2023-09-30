import { JobEntity } from "@domain/job/entites/job";
import { JobRepository } from "@domain/job/repositories/job-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAllJobsUsecase {
    execute: () => Promise<Either<ErrorClass, JobEntity[]>>;
}

export class GetAllJobs implements GetAllJobsUsecase {
    private readonly jobRepository: JobRepository;

    constructor(jobRepository: JobRepository) {
        this.jobRepository =jobRepository;
    }

    async execute(): Promise<Either<ErrorClass, JobEntity[]>> {
        return await this.jobRepository.getJobs();
    }
}
