import { JobApplicantEntity } from "@domain/jobApplicants/entites/jobApplicants";
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetJobApplicantByIdUsecase {
    execute: (jobApplicantId: string) => Promise<Either<ErrorClass, JobApplicantEntity>>;
}

export class GetJobApplicantById implements GetJobApplicantByIdUsecase {
    private readonly jobApplicantRepository: JobApplicantRepository;

    constructor(jobApplicantRepository: JobApplicantRepository) {
        this.jobApplicantRepository = jobApplicantRepository;
    }

    async execute(
        jobApplicantId: string
    ): Promise<Either<ErrorClass, JobApplicantEntity>> {
        return await this.jobApplicantRepository.getJobApplicantById(jobApplicantId);
    }
}
