// Express API request populate the Blocking Model
export class BlockingModel {
    constructor(
      public fromRealtor: string = "",
      public toRealtor: string = ""
    ) {}
  }
  
  // Blocking Entity provided by Blocking Repository is converted to Express API Response
  export class BlockingEntity {
    constructor(
      public id: string | undefined = undefined, // Set a default value for id
      public fromRealtor: string,
      public toRealtor: string
    ) {}
  }

  export class BlockingMapper {
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
            : existingBlocking.toRealtor
        };
      } else {
        // If existingBlocking is not provided, create a new BlockingEntity using blockingData
        const blockingEntity: BlockingEntity = {
          id: includeId ? (blockingData.id ? blockingData.id : undefined) : blockingData.id,
          fromRealtor: blockingData.fromRealtor,
          toRealtor: blockingData.toRealtor
        };
        return blockingData;
      }
    }
  
    static toModel(blocking: BlockingEntity): any {
      return {
        fromRealtor: blocking.fromRealtor,
        toRealtor: blocking.toRealtor
      };
    }
  }
  