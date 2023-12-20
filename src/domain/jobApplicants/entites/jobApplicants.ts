// Express API request DTO (Data Transfer Object) for Job Applicants
export class JobApplicantModel {
  constructor(
    public jobId: number = 0,
    public applicantId: string = "",
    public applicantStatus: string = "Pending",
    public applicantStatusUpdateTime: string = "", // Date of the jobApplicant
    public agreement: boolean = false,
    public jobStatus: string = "Pending",
    public paymentStatus: boolean = false,
    public paymentStatusUpdateTime: string = "", // Date of the jobApplicant
    public jobData: {} = {},
    public applicantData: {} = {}
  ) {}
}

// Job Applicant Entity provided by Job Applicant Repository is converted to Express API Response
export class JobApplicantEntity {
  constructor(
    public id: number | undefined = undefined,
    public jobId: number,
    public applicantId: string,
    public applicantStatus: string,
    public applicantStatusUpdateTime: string,
    public agreement: boolean,
    public jobStatus: string,
    public paymentStatus: boolean,
    public paymentStatusUpdateTime: string,
    public jobData: {},
    public applicantData: {}
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
        jobId:
          jobApplicantData.jobId !== undefined
            ? jobApplicantData.jobId
            : existingJobApplicant.jobId,
        applicantId:
          jobApplicantData.applicantId !== undefined
            ? jobApplicantData.applicantId
            : existingJobApplicant.applicantId,
        applicantStatus:
          jobApplicantData.applicantStatus !== undefined
            ? jobApplicantData.applicantStatus
            : existingJobApplicant.applicantStatus,
        applicantStatusUpdateTime:
          jobApplicantData.applicantStatusUpdateTime !== undefined
            ? jobApplicantData.applicantStatusUpdateTime
            : existingJobApplicant.applicantStatusUpdateTime,
        agreement:
          jobApplicantData.agreement !== undefined
            ? jobApplicantData.agreement
            : existingJobApplicant.agreement,
        jobStatus:
          jobApplicantData.jobStatus !== undefined
            ? jobApplicantData.jobStatus
            : existingJobApplicant.jobStatus,
        paymentStatus:
          jobApplicantData.paymentStatus !== undefined
            ? jobApplicantData.paymentStatus
            : existingJobApplicant.paymentStatus,
        paymentStatusUpdateTime:
          jobApplicantData.paymentStatusUpdateTime !== undefined
            ? jobApplicantData.paymentStatusUpdateTime
            : existingJobApplicant.paymentStatusUpdateTime,
      };
    } else {
      // If existingJobApplicant is not provided, create a new JobApplicantEntity using jobApplicantData
      const jobApplicantEntity: JobApplicantEntity = {
        id: includeId
          ? jobApplicantData.id
            ? jobApplicantData.id.toString()
            : undefined
          : jobApplicantData.id.toString(),
        jobId: jobApplicantData.jobId,
        applicantId: jobApplicantData.applicantId,
        applicantStatus: jobApplicantData.applicantStatus,
        applicantStatusUpdateTime: jobApplicantData.applicantStatusUpdateTime,
        agreement: jobApplicantData.agreement,
        jobStatus: jobApplicantData.jobStatus,
        paymentStatus: jobApplicantData.paymentStatus,
        paymentStatusUpdateTime: jobApplicantData.paymentStatusUpdateTime,
        jobData: jobApplicantData.jobData,
        applicantData: jobApplicantData.applicantData,
      };
      return jobApplicantEntity;
    }
  }

  // Static method to convert an Entity to a DTO or API response format
  static toModel(jobApplicant: JobApplicantEntity): any {
    return {
      id: jobApplicant.id,
      jobId: jobApplicant.jobId,
      applicantId: jobApplicant.applicantId,
      applicantStatus: jobApplicant.applicantStatus,
      applicantStatusUpdateTime: jobApplicant.applicantStatusUpdateTime,
      agreement: jobApplicant.agreement,
      jobStatus: jobApplicant.jobStatus,
      paymentStatus: jobApplicant.paymentStatus,
      paymentStatusUpdateTime: jobApplicant.paymentStatusUpdateTime,
      jobData: jobApplicant.jobData,
      applicantData: jobApplicant.applicantData,
    };
  }
}
