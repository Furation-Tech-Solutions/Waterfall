// Express API request DTO
export class JobModel {
  constructor(
    public jobOwner: number = 0, // Owner of the job
    public location: string = "", // Location of the job
    public address: string = "", // Address of the job
    public date: Date = new Date(), // Date of the job
    public numberOfApplicants: string = "", // Number of applicants needed
    public fromTime: string = "", // Start time of the job
    public toTime: string = "", // End time of the job
    public jobType: string = "", // Type of the job
    public clientEmail: string = "", // Client's email
    public clientPhoneNumber: string = "", // Client's phone number
    public feeType: string = "", // Type of fee
    public fee: string = "", // Fee amount
    public description: string = "", // Job description
    public attachments: string[] = [], // Job attachments
    public applyBy: Date = new Date(), // Application deadline
    public createdAt: Date | undefined = undefined, // Creation date of the job (optional)
    public deleteReason: string = "" ,// Reason for job deletion
    public coordinates: { latitude: string; longitude: string } | null = null
  ) {}
}

// Job Entity provided by Job Repository is converted to Express API Response
export class JobEntity {
  constructor(
    public id: number | undefined = undefined, // Job ID (optional)
    public jobOwner: number, // Owner of the job
    public location: string, // Location of the job
    public address: string, // Address of the job
    public date: Date, // Date of the job
    public numberOfApplicants: string, // Number of applicants needed
    public fromTime: string, // Start time of the job
    public toTime: string, // End time of the job
    public jobType: string, // Type of the job
    public clientEmail: string, // Client's email
    public clientPhoneNumber: string, // Client's phone number
    public feeType: string, // Type of fee
    public fee: string, // Fee amount
    public description: string, // Job description
    public attachments: string[], // Job attachments
    public applyBy: Date, // Application deadline
    public createdAt: Date | undefined = undefined, // Creation date of the job (optional)
    public deleteReason: string, // Reason for job deletion
    public coordinates: { latitude: string; longitude: string } | null = null,
  ) {}
}

export class JobMapper {
  static toEntity(
    jobData: any, // Input data to convert to JobEntity
    includeId?: boolean, // Include ID in the result (optional)
    existingJob?: JobEntity // Existing JobEntity to merge with (optional)
  ): JobEntity {
    if (existingJob != null) {
      // If an existingJob is provided, merge the data from jobData with the existingJob

      // Merge properties one by one, using jobData if defined, or fall back to existingJob's properties
      return {
        ...existingJob,
        jobOwner:
          jobData.jobOwner !== undefined
            ? jobData.jobOwner
            : existingJob.jobOwner,
        location:
          jobData.location !== undefined
            ? jobData.location
            : existingJob.location,
        address:
          jobData.address !== undefined ? jobData.address : existingJob.address,
        date: jobData.date !== undefined ? jobData.date : existingJob.date,
        numberOfApplicants:
          jobData.numberOfApplicants !== undefined
            ? jobData.numberOfApplicants
            : existingJob.numberOfApplicants,
        fromTime:
          jobData.fromTime !== undefined
            ? jobData.fromTime
            : existingJob.fromTime,
        toTime:
          jobData.toTime !== undefined ? jobData.toTime : existingJob.toTime,
        jobType:
          jobData.jobType !== undefined ? jobData.jobType : existingJob.jobType,
        clientEmail:
          jobData.clientEmail !== undefined
            ? jobData.clientEmail
            : existingJob.clientEmail,
        clientPhoneNumber:
          jobData.clientPhoneNumber !== undefined
            ? jobData.clientPhoneNumber
            : existingJob.clientPhoneNumber,
        feeType:
          jobData.feeType !== undefined ? jobData.feeType : existingJob.feeType,
        fee: jobData.fee !== undefined ? jobData.fee : existingJob.fee,
        description:
          jobData.description !== undefined
            ? jobData.description
            : existingJob.description,
        attachments:
          jobData.attachments !== undefined
            ? jobData.attachments
            : existingJob.attachments,
        applyBy:
          jobData.applyBy !== undefined ? jobData.applyBy : existingJob.applyBy,
        createdAt:
          jobData.createdAt !== undefined
            ? jobData.createdAt
            : existingJob.createdAt,
        deleteReason:
          jobData.deleteReason !== undefined
            ? jobData.deleteReason
            : existingJob.deleteReason,
          coordinates: jobData.coordinates !== undefined
            ? jobData.coordinates
            : existingJob.coordinates
      };
    } else {
      // If an existingJob is not provided, create a new JobEntity using jobData
      const jobEntity: JobEntity = {
        id: includeId
          ? jobData.id
            ? jobData.id.toString()
            : undefined
          : jobData.id.toString(),
        jobOwner: jobData.jobOwner,
        location: jobData.location,
        address: jobData.address,
        date: jobData.date,
        numberOfApplicants: jobData.numberOfApplicants,
        fromTime: jobData.fromTime,
        toTime: jobData.toTime,
        jobType: jobData.jobType,
        clientEmail: jobData.clientEmail,
        clientPhoneNumber: jobData.clientPhoneNumber,
        feeType: jobData.feeType,
        fee: jobData.fee,
        description: jobData.description,
        attachments: jobData.attachments,
        applyBy: jobData.applyBy,
        createdAt: jobData.createdAt,
        deleteReason: jobData.deleteReason,
        coordinates: jobData.coordinates || null,
      };
      return jobData;
    }
  }

  static toModel(job: JobEntity): any {
    // Convert a JobEntity to a model that can be used in the API response

    // Map properties one by one
    return {
      id: job.id,
      jobOwner: job.jobOwner,
      location: job.location,
      address: job.address,
      date: job.date,
      numberOfApplicants: job.numberOfApplicants,
      fromTime: job.fromTime,
      toTime: job.toTime,
      jobType: job.jobType,
      clientEmail: job.clientEmail,
      clientPhoneNumber: job.clientPhoneNumber,
      feeType: job.feeType,
      fee: job.fee,
      description: job.description,
      attachments: job.attachments,
      applyBy: job.applyBy,
      createdAt: job.createdAt,
      deleteReason: job.deleteReason,
      coordinates: job.coordinates,
    };
  }
}
