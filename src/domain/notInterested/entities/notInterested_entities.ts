// Express API request DTO (Data Transfer Object) for NotInterested
export class NotInterestedModel {
  constructor(
    public realtorId: string = "", // Realtor name, default value is an empty string
    public jobId: number = 0, // Job name, default value is an empty string
    public realtorData: {} = {},
    public jobData: {} = {}
    
  ) {}
}

// NotInterested Entity provided by NotInterested Repository is converted to Express API Response
export class NotInterestedEntity {
  constructor(
    public id: number | undefined = undefined, // Unique identifier for the saved job, initially undefined
    public realtorId: string, // Realtor name
    public jobId: number, // Job name
    public realtorData: {},
    public jobData: {}
    
  ) {}
}

export class NotInterestedMapper {
  // Converts input data into a NotInterestedEntity object
  static toEntity(
    notInterestedData: any, // Input data for the saved job
    includeId?: boolean, // Optional flag to include an ID
    existingNotInterested?: NotInterestedEntity // Optional existing NotInterestedEntity to merge with
  ): NotInterestedEntity {
    if (existingNotInterested != null) {
      // If existingNotInterested is provided, merge the data from NotInterestedData with the existingNotInterested
      return {
        ...existingNotInterested,
        realtorId:
          notInterestedData.realtorId !== undefined
            ? notInterestedData.realtorId
            : existingNotInterested.realtorId, // Use existing Realtor if not provided in notInterestedData
        jobId:
          notInterestedData.jobId !== undefined
            ? notInterestedData.jobId
            : existingNotInterested.jobId, // Use existing Job if not provided in notInterestedData
      };
    } else {
      // If existingNotInterested is not provided, create a new notInterestedEntity using notInterestedData
      const notInterestedEntity: NotInterestedEntity = {
        id: includeId
          ? notInterestedData.id
            ? notInterestedData.id
            : undefined
          : notInterestedData.id, // Set the ID if includeId is true
        realtorId: notInterestedData.realtorId, // Set Realtor from notInterestedData
        jobId: notInterestedData.jobId, // Set Job from notInterestedData
        realtorData: notInterestedData.realtorData,
        jobData: notInterestedData.jobData,
      };
      return notInterestedEntity;
    }
  }

  // Converts a NotInterestedEntity object into a generic object (model)
  static toModel(notInterested: NotInterestedEntity): any {
    return {
      id: notInterested.id, // Extract and include the ID
      realtorId: notInterested.realtorId, // Extract and include Realtor
      jobId: notInterested.jobId, // Extract and include Job
      realtorData: notInterested.realtorData,
      jobData: notInterested.jobData,
    };
  }
}
