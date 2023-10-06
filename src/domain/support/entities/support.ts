// Express API request DTO
export class SupportModel {
  constructor(
    public realtor: string = "",
    public to: string = "",
    public description: string = "",
    public attachments: string[] | undefined = undefined
  ) {}
}

// Support Entity provided by Support Repository is converted to Express API Response
export class SupportEntity {
  constructor(
    public id: string | undefined = undefined,
    public realtor: string,
    public to: string,
    public description: string,
    public attachments: string[] | undefined = undefined,
    public timestamp: Date = new Date()
  ) {}
}

export class SupportMapper {
  static toEntity(
    supportData: any,
    includeId?: boolean,
    existingSupport?: SupportEntity
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
      return supportEntity;
    }
  }

  static toModel(support: SupportEntity): any {
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
