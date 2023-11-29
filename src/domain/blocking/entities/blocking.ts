// Define a class for the BlockingModel, representing the structure of data sent in Express API requests
export class BlockingModel {
  constructor(
    public fromRealtor: string = "",
    public toRealtor: string = "",
    public fromRealtorData: {} = {},
    public toRealtorData: {} = {},
  ) { }
}

// Define a class for the BlockingEntity, representing data provided by the Blocking Repository and converted to an Express API response
export class BlockingEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public fromRealtor: string,
    public toRealtor: string,
    public fromRealtorData: object,
    public toRealtorData: object,
  ) { }
}

// Define a BlockingMapper class to handle the mapping between BlockingModel and BlockingEntity
export class BlockingMapper {
  // Convert raw data (blockingData) to a BlockingEntity
  static toEntity(
    blockingData: any,
    includeId?: boolean,
    existingBlocking?: BlockingEntity
  ): BlockingEntity {
    if (existingBlocking != null) {
      // If existingBlocking is provided, merge the data from blockingData with the existingBlocking
      return {
        ...existingBlocking,
        fromRealtor:
          blockingData.fromRealtor !== undefined
            ? blockingData.fromRealtor
            : existingBlocking.fromRealtor,
        toRealtor:
          blockingData.toRealtor !== undefined
            ? blockingData.toRealtor
            : existingBlocking.toRealtor,
      };
    } else {
      // If existingBlocking is not provided, create a new BlockingEntity using blockingData
      const blockingEntity: BlockingEntity = {
        id: includeId ? (blockingData.id ? blockingData.id : undefined) : blockingData.id,
        fromRealtor: blockingData.fromRealtor,
        toRealtor: blockingData.toRealtor,
        fromRealtorData: blockingData.fromRealtorData,
        toRealtorData: blockingData.toRealtorData
      };
      return blockingEntity;
    }
  }

  // Convert a BlockingEntity to a format suitable for a model
  static toModel(blocking: BlockingEntity): any {
    return {
      fromRealtor: blocking.fromRealtor,
      toRealtor: blocking.toRealtor,
      fromRealtorData: blocking.fromRealtorData,
      toRealtorData: blocking.toRealtorData
    };
  }
}
