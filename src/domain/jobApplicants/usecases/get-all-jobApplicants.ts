import { JobApplicantEntity } from "@domain/jobApplicants/entites/jobApplicants";
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetAllJobApplicantsUsecase {
    execute: () => Promise<Either<ErrorClass, JobApplicantEntity[]>>;
}

export class GetAllJobApplicants implements GetAllJobApplicantsUsecase {
    private readonly jobApplicantRepository: JobApplicantRepository;

    constructor(jobApplicantRepository: JobApplicantRepository) {
        this.jobApplicantRepository = jobApplicantRepository;
    }

    async execute(): Promise<Either<ErrorClass, JobApplicantEntity[]>> {
        return await this.jobApplicantRepository.getJobApplicants();
    }
}
