// Express API request DTO
export class SupportModel {
  constructor(
    // The name of the realtor associated with the support request
    public realtor: number = 0,
    // The recipient of the support request
    public to: number = 0,
    // A description of the support request
    public description: string = "",
    // An array of attachments (optional) related to the support request
    public attachments: string[] | undefined = undefined
  ) {}
}

// Support Entity provided by Support Repository is converted to Express API Response
export class SupportEntity {
  constructor(
    // The unique identifier for the support request (optional)
    public id: number| undefined = undefined,
    // The name of the realtor associated with the support request
    public realtor: number,
    // The recipient of the support request
    public to: number,
    // A description of the support request
    public description: string,
    // An array of attachments (optional) related to the support request
    public attachments: string[] | undefined = undefined,
    // The timestamp when the support request was created (default to current date)
    public timestamp: Date = new Date()
  ) {}
}

export class SupportMapper {
  static toEntity(
    supportData: any, // Input data for creating or updating a SupportEntity
    includeId?: boolean, // Flag to include the ID when creating a new entity
    existingSupport?: SupportEntity // Existing SupportEntity to update (optional)
  ): SupportEntity {
    if (existingSupport != null) {
      // If existingSupport is provided, merge the data from supportData with the existingSupport
      return {
        ...existingSupport,
        realtor:
          supportData.realtor !== undefined
            ? supportData.realtor
            : existingSupport.realtor,
        to: supportData.to !== undefined ? supportData.to : existingSupport.to,
        description:
          supportData.description !== undefined
            ? supportData.description
            : existingSupport.description,
        attachments:
          supportData.attachments !== undefined
            ? supportData.attachments
            : existingSupport.attachments,
        timestamp:
          supportData.timestamp !== undefined
            ? supportData.timestamp
            : existingSupport.timestamp,
      };
    } else {
      // If existingSupport is not provided, create a new SupportEntity using supportData
      const supportEntity: SupportEntity = {
        id: includeId
          ? supportData.id
            ? supportData.id.toString()
            : undefined
          : supportData.id.toString(),
        realtor: supportData.realtor,
        to: supportData.to,
        description: supportData.description,
        attachments: supportData.attachments,
        timestamp: supportData.timestamp,
      };
      return supportData;
    }
  }

  static toModel(support: SupportEntity): any {
    // Convert a SupportEntity to a plain JavaScript object (model)
    return {
      id: support.id,
      realtor: support.realtor,
      to: support.to,
      description: support.description,
      attachments: support.attachments,
      timestamp: support.timestamp,
    };
  }
}
