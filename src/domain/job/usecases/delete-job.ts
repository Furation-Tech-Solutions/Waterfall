import { JobRepository } from "@domain/job/repositories/job-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface DeleteJobUsecase {
    execute: (jobId: string) => Promise<Either<ErrorClass, void>>;
}

export class DeleteJob implements DeleteJobUsecase {
    private readonly jobRepository: JobRepository;

    constructor(jobRepository: JobRepository) {
        this.jobRepository = jobRepository;
    }

    async execute(jobId: string): Promise<Either<ErrorClass, void>> {
        return await this.jobRepository.deleteJob(jobId);
    }
}
