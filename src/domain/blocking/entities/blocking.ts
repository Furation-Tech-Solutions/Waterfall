// Define a class for the BlockingModel, representing the structure of data sent in Express API requests
export class BlockingModel {
  constructor(
    public fromRealtorId: string = "",
    public toRealtorId: string = "",
    public fromRealtorIdData: {} = {},
    public toRealtorIdData: {} = {}
  ) {}
}

// Define a class for the BlockingEntity, representing data provided by the Blocking Repository and converted to an Express API response
export class BlockingEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public fromRealtorId: string,
    public toRealtorId: string,
    public fromRealtorIdData: object,
    public toRealtorIdData: object
  ) {}
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
        fromRealtorId:
          blockingData.fromRealtorId !== undefined
            ? blockingData.fromRealtorId
            : existingBlocking.fromRealtorId,
        toRealtorId:
          blockingData.toRealtorId !== undefined
            ? blockingData.toRealtorId
            : existingBlocking.toRealtorId,
      };
    } else {
      // If existingBlocking is not provided, create a new BlockingEntity using blockingData
      const blockingEntity: BlockingEntity = {
        id: includeId
          ? blockingData.id
            ? blockingData.id
            : undefined
          : blockingData.id,
        fromRealtorId: blockingData.fromRealtorId,
        toRealtorId: blockingData.toRealtorId,
        fromRealtorIdData: blockingData.fromRealtorIdData,
        toRealtorIdData: blockingData.toRealtorIdData,
      };
      return blockingEntity;
    }
  }

  // Convert a BlockingEntity to a format suitable for a model
  static toModel(blocking: BlockingEntity): any {
    return {
      fromRealtorId: blocking.fromRealtorId,
      toRealtorId: blocking.toRealtorId,
      fromRealtorIdData: blocking.fromRealtorIdData,
      toRealtorIdData: blocking.toRealtorIdData,
    };
  }
}
