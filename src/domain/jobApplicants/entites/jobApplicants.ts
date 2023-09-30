// Express API request DTO
export class JobApplicantModel {
    constructor(
        public job: string = "",
        public applicant: string = "",
        public status: string = "pending",
        public appliedTimestamp: Date = new Date(),
        // public agreement: string | undefined = undefined
    ) { }
}

// Job Applicant Entity provided by Job Applicant Repository is converted to Express API Response
export class JobApplicantEntity {
    constructor(
        public id: string | undefined = undefined,
        public job: string,
        public applicant: string,
        public status: string,
        public appliedTimestamp: Date,
        // public agreement: string | undefined = undefined
    ) { }
}

export class JobApplicantMapper {
    static toEntity(
        jobApplicantData: any,
        includeId?: boolean,
        existingJobApplicant?: JobApplicantEntity
    ): JobApplicantEntity {
        if (existingJobApplicant != null) {
            // If existingJobApplicant is provided, merge the data from jobApplicantData with the existingJobApplicant
            return {
                ...existingJobApplicant,
                job: jobApplicantData.job !== undefined ? jobApplicantData.job : existingJobApplicant.job,
                applicant: jobApplicantData.applicant !== undefined ? jobApplicantData.applicant : existingJobApplicant.applicant,
                status: jobApplicantData.status !== undefined ? jobApplicantData.status : existingJobApplicant.status,
                appliedTimestamp: jobApplicantData.appliedTimestamp !== undefined ? jobApplicantData.appliedTimestamp : existingJobApplicant.appliedTimestamp,
                // agreement: jobApplicantData.agreement !== undefined ? jobApplicantData.agreement : existingJobApplicant.agreement,
            };
        } else {
            // If existingJobApplicant is not provided, create a new JobApplicantEntity using jobApplicantData
            const jobApplicantEntity: JobApplicantEntity = {
                id: includeId ? jobApplicantData._id ? jobApplicantData._id.toString() : undefined : undefined,
                job: jobApplicantData.job,
                applicant: jobApplicantData.applicant,
                status: jobApplicantData.status,
                appliedTimestamp: jobApplicantData.appliedTimestamp,
                // agreement: jobApplicantData.agreement,
            };
            return jobApplicantEntity;
        }
    }

    static toModel(jobApplicant: JobApplicantEntity): any {
        return {
            id: jobApplicant.id,
            job: jobApplicant.job,
            applicant: jobApplicant.applicant,
            status: jobApplicant.status,
            appliedTimestamp: jobApplicant.appliedTimestamp,
            // agreement: jobApplicant.agreement,
        };
    }
}
