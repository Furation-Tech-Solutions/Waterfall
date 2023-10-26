// Express API request DTO (Data Transfer Object) for Job Applicants
export class JobApplicantModel {
  constructor(
    public job: number = 0,
    public applicant: number = 0,
    public applicantStatus: string = "Pending",
    public agreement: boolean = false,
    public jobStatus: string = "Pending",
    public appliedTimestamp: Date = new Date(),
    public paymentStatus: boolean = false
  ) {}
}

// Job Applicant Entity provided by Job Applicant Repository is converted to Express API Response
export class JobApplicantEntity {
  constructor(
    public id: number | undefined = undefined,
    public job: number,
    public applicant: number,
    public applicantStatus: string,
    public agreement: boolean,
    public jobStatus: string,
    public appliedTimestamp: Date,
    public paymentStatus: boolean
  ) {}
}

// Mapper class to convert between DTO, Entity, and API response formats
export class JobApplicantMapper {
  // Static method to convert DTO or API request data to an Entity
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
        applicantStatus:
          jobApplicantData.applicantStatus !== undefined
            ? jobApplicantData.applicantStatus
            : existingJobApplicant.applicantStatus,
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
        paymentStatus:
          jobApplicantData.paymentStatus !== undefined
            ? jobApplicantData.paymentStatus
            : existingJobApplicant.paymentStatus,
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
        applicantStatus: jobApplicantData.applicantStatus,
        agreement: jobApplicantData.agreement,
        jobStatus: jobApplicantData.jobStatus,
        appliedTimestamp: jobApplicantData.appliedTimestamp,
        paymentStatus: jobApplicantData.paymentStatus,
      };
      return jobApplicantData;
    }
  }

  // Static method to convert an Entity to a DTO or API response format
  static toModel(jobApplicant: JobApplicantEntity): any {
    return {
      id: jobApplicant.id,
      job: jobApplicant.job,
      applicant: jobApplicant.applicant,
      applicantStatus: jobApplicant.applicantStatus,
      agreement: jobApplicant.agreement,
      jobStatus: jobApplicant.jobStatus,
      appliedTimestamp: jobApplicant.appliedTimestamp,
      paymentStatus: jobApplicant.paymentStatus,
    };
  }
}
