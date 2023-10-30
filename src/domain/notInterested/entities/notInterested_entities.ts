// Express API request DTO (Data Transfer Object) for NotInterested
export class NotInterestedModel {
  constructor(
    public realtor: number = 0, // Realtor name, default value is an empty string
    public job: number = 0, // Job name, default value is an empty string
    public jobData: {} = {},
    public realtorData: {} = {},
  ) { }
}

// NotInterested Entity provided by NotInterested Repository is converted to Express API Response
export class NotInterestedEntity {
  constructor(
    public id: number | undefined = undefined, // Unique identifier for the saved job, initially undefined
    public realtor: number, // Realtor name
    public job: number, // Job name
    public jobData: {},
    public realtorData: {},
  ) { }
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
        realtor:
          notInterestedData.realtor !== undefined
            ? notInterestedData.realtor
            : existingNotInterested.realtor, // Use existing Realtor if not provided in notInterestedData
        job:
          notInterestedData.job !== undefined
            ? notInterestedData.job
            : existingNotInterested.job, // Use existing Job if not provided in notInterestedData
      };
    } else {
      // If existingNotInterested is not provided, create a new notInterestedEntity using notInterestedData
      const notInterestedEntity: NotInterestedEntity = {
        id: includeId
          ? notInterestedData.id
            ? notInterestedData.id
            : undefined
          : notInterestedData.id,// Set the ID if includeId is true
        realtor: notInterestedData.realtor, // Set Realtor from notInterestedData
        job: notInterestedData.job, // Set Job from notInterestedData
        jobData: notInterestedData.jobData,
        realtorData: notInterestedData.realtorData,
      };
      return notInterestedEntity;
    }
  }

  // Converts a NotInterestedEntity object into a generic object (model)
  static toModel(notInterested: NotInterestedEntity): any {
    return {
      id: notInterested.id, // Extract and include the ID
      realtor: notInterested.realtor, // Extract and include Realtor
      job: notInterested.job, // Extract and include Job
      jobData: notInterested.jobData,
      realtorData: notInterested.realtorData,
    };
  }
}
