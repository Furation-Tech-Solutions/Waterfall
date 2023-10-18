// Express API request DTO (Data Transfer Object) for NotInterested
export class NotInterestedModel {
  constructor(
    public Realtor: string = "", // Realtor name, default value is an empty string
    public Job: string = "" // Job name, default value is an empty string
  ) {}
}

// NotInterested Entity provided by NotInterested Repository is converted to Express API Response
export class NotInterestedEntity {
  constructor(
    public id: string | undefined = undefined, // Unique identifier for the saved job, initially undefined
    public Realtor: string, // Realtor name
    public Job: string // Job name
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
        Realtor:
          notInterestedData.Realtor !== undefined
            ? notInterestedData.Realtor
            : existingNotInterested.Realtor, // Use existing Realtor if not provided in notInterestedData
        Job:
          notInterestedData.Job !== undefined
            ? notInterestedData.Job
            : existingNotInterested.Job, // Use existing Job if not provided in notInterestedData
      };
    } else {
      // If existingNotInterested is not provided, create a new notInterestedEntity using notInterestedData
      const notInterestedEntity: NotInterestedEntity = {
        id: includeId
          ? notInterestedData.id
            ? notInterestedData.id.toString()
            : undefined
          : notInterestedData.id, // Set the ID if includeId is true
        Realtor: notInterestedData.Realtor, // Set Realtor from notInterestedData
        Job: notInterestedData.Job, // Set Job from notInterestedData
      };
      return notInterestedEntity;
    }
  }

  // Converts a NotInterestedEntity object into a generic object (model)
  static toModel(notInterested: NotInterestedEntity): any {
    return {
      id: notInterested.id, // Extract and include the ID
      Realtor: notInterested.Realtor, // Extract and include Realtor
      Job: notInterested.Job, // Extract and include Job
    };
  }
}
