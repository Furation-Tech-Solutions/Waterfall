// Express API request DTO for SavedJobs
export class SavedJobModel {
  constructor(
    public Realtor: string = "", 
    public Job: string = ""
    ) {}
}

// SavedJobs Entity provided by SavedJobs Repository is converted to Express API Response
export class SavedJobEntity {
  constructor(
    public id: string | undefined = undefined,
    public Realtor: string,
    public Job: string
  ) {}
}

export class SavedJobMapper {
  static toEntity(
    savedJobData: any,
    includeId?: boolean,
    existingSavedJob?: SavedJobEntity
  ): SavedJobEntity {
    if (existingSavedJob != null) {
      // If existingSavedJob is provided, merge the data from SavedJobData with the existingSavedJob
      return {
        ...existingSavedJob,
        Realtor:
          savedJobData.Realtor !== undefined
            ? savedJobData.Realtor
            : existingSavedJob.Realtor,
        Job:
          savedJobData.Job !== undefined
            ? savedJobData.Job
            : existingSavedJob.Job,
      };
    } else {
      // If existingsavedJob is not provided, create a new savedJobEntity using savedJobData
      const savedJobEntity: SavedJobEntity = {
        id: includeId
          ? savedJobData.id
            ? savedJobData.id.toString()
            : undefined
          : savedJobData.id,
        Realtor: savedJobData.Realtor,
        Job: savedJobData.Job,
      };
      return savedJobEntity;
    }
  }

  static toModel(savedJob: SavedJobEntity): any {
    return {
      id: savedJob.id,
      Realtor: savedJob.Realtor,
      Job: savedJob.Job,
    };
  }
}
