// Express API request populate the FeedBack Model
export class FeedBackModel {
    constructor(
      public fromRealtor: string = "",
      public toRealtor: string = "",
      public jobId: string = "",
      public rating: number  = 0,
      public description: string = ""
    ) {}
  }
  
  // FeedBack Entity provided by FeedBack Repository is converted to Express API Response
  export class FeedBackEntity {
    constructor(
      public id: string | undefined = undefined, // Set a default value for id
      public fromRealtor: string,
      public toRealtor: string,
      public jobId: string,
      public rating: number,
      public description: string
    ) {}
  }

  export class FeedBackMapper {
    static toEntity(
      feedBackData: any,
      includeId?: boolean,
      existingFeedBack?: FeedBackEntity
    ): FeedBackEntity {
      if (existingFeedBack != null) {
        // If existingFeedBack is provided, merge the data from feedBackData with the existingFeedBack
        return {
          ...existingFeedBack,
          fromRealtor:
            feedBackData.fromRealtor !== undefined 
            ? feedBackData.fromRealtor 
            : existingFeedBack.fromRealtor,
          toRealtor:
            feedBackData.toRealtor !== undefined 
            ? feedBackData.toRealtor 
            : existingFeedBack.toRealtor,
          jobId:
            feedBackData.jobId !== undefined 
            ? feedBackData.jobId 
            : existingFeedBack.jobId,
          rating:
            feedBackData.rating !== undefined 
            ? feedBackData.rating 
            : existingFeedBack.rating,
          description:
            feedBackData.description !== undefined 
            ? feedBackData.description 
            : existingFeedBack.description
        };
      } else {
        // If existingFeedBack is not provided, create a new FeedBackEntity using feedBackData
        const feedBackEntity: FeedBackEntity = {
          id: includeId ? (feedBackData.id ? feedBackData.id : undefined) : feedBackData.id,
          fromRealtor: feedBackData.fromRealtor,
          toRealtor: feedBackData.toRealtor,
          jobId: feedBackData.toRealtor,
          rating: feedBackData.toRealtor,
          description: feedBackData.toRealtor
        };
        return feedBackData;
      }
    }
  
    static toModel(feedBack: FeedBackEntity): any {
      return {
        fromRealtor: feedBack.fromRealtor,
        toRealtor: feedBack.toRealtor,
        jobId: feedBack.toRealtor,
        rating: feedBack.toRealtor,
        description: feedBack.toRealtor
      };
    }
  }
  