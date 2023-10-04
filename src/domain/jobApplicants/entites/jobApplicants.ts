// Express API request DTO
export class JobApplicantModel {
  constructor(
    public job: string = "",
    public applicant: string = "",
    public status: string = "Pending",
    public agreement: boolean = false,
    public jobStatus: string = "Pending",
    public appliedTimestamp: Date = new Date()
  ) {}
}

// Job Applicant Entity provided by Job Applicant Repository is converted to Express API Response
export class JobApplicantEntity {
  constructor(
    public id: string | undefined = undefined,
    public job: string,
    public applicant: string,
    public status: string,
    public agreement: boolean,
    public jobStatus: string,
    public appliedTimestamp: Date
  ) {}
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
        job:
          jobApplicantData.job !== undefined
            ? jobApplicantData.job
            : existingJobApplicant.job,
        applicant:
          jobApplicantData.applicant !== undefined
            ? jobApplicantData.applicant
            : existingJobApplicant.applicant,
        status:
          jobApplicantData.status !== undefined
            ? jobApplicantData.status
            : existingJobApplicant.status,
        agreement:
          jobApplicantData.agreement !== undefined
            ? jobApplicantData.agreement
            : existingJobApplicant.agreement,
        jobStatus:
          jobApplicantData.jobStatus !== undefined
            ? jobApplicantData.jobStatus
            : existingJobApplicant.jobStatus,
        appliedTimestamp:
          jobApplicantData.appliedTimestamp !== undefined
            ? jobApplicantData.appliedTimestamp
            : existingJobApplicant.appliedTimestamp,
      };
    } else {
      // If existingJobApplicant is not provided, create a new JobApplicantEntity using jobApplicantData
      const jobApplicantEntity: JobApplicantEntity = {
        id: includeId
          ? jobApplicantData.id
            ? jobApplicantData.id.toString()
            : undefined
          : jobApplicantData.id.toString(),
        job: jobApplicantData.job,
        applicant: jobApplicantData.applicant,
        status: jobApplicantData.status,
        agreement: jobApplicantData.agreement,
        jobStatus: jobApplicantData.jobStatus,
        appliedTimestamp: jobApplicantData.appliedTimestamp,
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
      agreement: jobApplicant.agreement,
      jobStatus: jobApplicant.jobStatus,
      appliedTimestamp: jobApplicant.appliedTimestamp,
    };
  }
}
