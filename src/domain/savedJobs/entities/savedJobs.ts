// Express API request DTO (Data Transfer Object) for SavedJobs
export class SavedJobModel {
  constructor(
    public realtorId: string = "", // Realtor name, default value is an empty string
    public jobId: number = 0, // Job name, default value is an empty string
    public jobData: {} = {},
    public realtorData: {} = {}
  ) {}
}

// SavedJobs Entity provided by SavedJobs Repository is converted to Express API Response
export class SavedJobEntity {
  constructor(
    public id: number | undefined = undefined, // Unique identifier for the saved job, initially undefined
    public realtorId: string, // Realtor name
    public jobId: number, // Job name
    public jobData: {},
    public realtorData: {}
  ) {}
}

export class SavedJobMapper {
  // Converts input data into a SavedJobEntity object
  static toEntity(
    savedJobData: any, // Input data for the saved job
    includeId?: boolean, // Optional flag to include an ID
    existingSavedJob?: SavedJobEntity // Optional existing SavedJobEntity to merge with
  ): SavedJobEntity {
    if (existingSavedJob != null) {
      // If existingSavedJob is provided, merge the data from SavedJobData with the existingSavedJob
      return {
        ...existingSavedJob,
        realtorId:
          savedJobData.realtorId !== undefined
            ? savedJobData.realtorId
            : existingSavedJob.realtorId, // Use existing Realtor if not provided in savedJobData
        jobId:
          savedJobData.jobId !== undefined
            ? savedJobData.jobId
            : existingSavedJob.jobId, // Use existing Job if not provided in savedJobData
      };
    } else {
      // If existingSavedJob is not provided, create a new savedJobEntity using savedJobData
      const savedJobEntity: SavedJobEntity = {
        id: includeId
          ? savedJobData.id
            ? savedJobData.id.toString()
            : undefined
          : savedJobData.id, // Set the ID if includeId is true
        realtorId: savedJobData.realtorId, // Set Realtor from savedJobData
        jobId: savedJobData.jobId, // Set Job from savedJobData
        jobData: savedJobData.jobData,
        realtorData: savedJobData.realtorData,
      };
      return savedJobData;
    }
  }

  // Converts a SavedJobEntity object into a generic object (model)
  static toModel(savedJob: SavedJobEntity): any {
    return {
      id: savedJob.id, // Extract and include the ID
      realtorId: savedJob.realtorId, // Extract and include Realtor
      jobId: savedJob.jobId, // Extract and include Job
      jobData: savedJob.jobData,
      realtorData: savedJob.realtorData,
    };
  }
}
