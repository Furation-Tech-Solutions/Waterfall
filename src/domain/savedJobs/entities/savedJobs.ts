// Express API request DTO (Data Transfer Object) for SavedJobs
export class SavedJobModel {
  constructor(
    public Realtor: number = 0, // Realtor name, default value is an empty string
    public Job: number = 0 // Job name, default value is an empty string
  ) {}
}

// SavedJobs Entity provided by SavedJobs Repository is converted to Express API Response
export class SavedJobEntity {
  constructor(
    public id: number| undefined = undefined, // Unique identifier for the saved job, initially undefined
    public Realtor: number, // Realtor name
    public Job: number // Job name
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
        Realtor:
          savedJobData.Realtor !== undefined
            ? savedJobData.Realtor
            : existingSavedJob.Realtor, // Use existing Realtor if not provided in savedJobData
        Job:
          savedJobData.Job !== undefined
            ? savedJobData.Job
            : existingSavedJob.Job, // Use existing Job if not provided in savedJobData
      };
    } else {
      // If existingSavedJob is not provided, create a new savedJobEntity using savedJobData
      const savedJobEntity: SavedJobEntity = {
        id: includeId
          ? savedJobData.id
            ? savedJobData.id.toString()
            : undefined
          : savedJobData.id, // Set the ID if includeId is true
        Realtor: savedJobData.Realtor, // Set Realtor from savedJobData
        Job: savedJobData.Job, // Set Job from savedJobData
      };
      return savedJobData;
    }
  }

  // Converts a SavedJobEntity object into a generic object (model)
  static toModel(savedJob: SavedJobEntity): any {
    return {
      id: savedJob.id, // Extract and include the ID
      Realtor: savedJob.Realtor, // Extract and include Realtor
      Job: savedJob.Job, // Extract and include Job
    };
  }
}
