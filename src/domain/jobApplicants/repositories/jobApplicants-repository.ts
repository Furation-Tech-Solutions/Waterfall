import { JobApplicantEntity, JobApplicantModel } from "@domain/jobApplicants/entites/jobApplicants";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface JobApplicantRepository {
    createJobApplicant(
        jobApplicant: JobApplicantModel
    ): Promise<Either<ErrorClass, JobApplicantEntity>>;
    updateJobApplicant(
        id: string,
        data: JobApplicantModel
    ): Promise<Either<ErrorClass, JobApplicantEntity>>;
    getJobApplicants(): Promise<Either<ErrorClass, JobApplicantEntity[]>>;
    getJobApplicantById(id: string): Promise<Either<ErrorClass, JobApplicantEntity>>;
}


