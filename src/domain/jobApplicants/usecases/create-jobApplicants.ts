import { JobApplicantEntity, JobApplicantModel } from "@domain/jobApplicants/entites/jobApplicants";
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateJobApplicantUsecase {
    execute: (
        jobApplicantData: JobApplicantModel
    ) => Promise<Either<ErrorClass, JobApplicantEntity>>;
}

export class CreateJobApplicant implements CreateJobApplicantUsecase {
    private readonly jobApplicantRepository: JobApplicantRepository;

    constructor(jobApplicantRepository: JobApplicantRepository) {
        this.jobApplicantRepository = jobApplicantRepository;
    }

    async execute(
        jobApplicantData: JobApplicantModel
    ): Promise<Either<ErrorClass, JobApplicantEntity>> {
        return await this.jobApplicantRepository.createJobApplicant(jobApplicantData);
    }
}
