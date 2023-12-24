// Express API request populates the FeedBack Model
export class FeedBackModel {
  constructor(
    public fromRealtorId: string = "",
    public toRealtorId: string = "",
    public jobId: number = 0,
    public rating: number = 0,
    public description: string = "",
    public fromRealtorData: {} = {},
    public toRealtorData: {} = {},
    public jobData: {} = {}
  ) {}
}

// FeedBack Entity provided by FeedBack Repository is converted to Express API Response
export class FeedBackEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public fromRealtorId: string,
    public toRealtorId: string,
    public jobId: number,
    public rating: number,
    public description: string,
    public fromRealtorData: {},
    public toRealtorData: {},
    public jobData: {}
  ) {}
}

// Mapper class to convert data between model, entity, and response
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
        fromRealtorId:
          feedBackData.fromRealtorId !== undefined
            ? feedBackData.fromRealtorId
            : existingFeedBack.fromRealtorId,
        toRealtorId:
          feedBackData.toRealtorId !== undefined
            ? feedBackData.toRealtorId
            : existingFeedBack.toRealtorId,
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
            : existingFeedBack.description,
      };
    } else {
      // If existingFeedBack is not provided, create a new FeedBackEntity using feedBackData
      const feedBackEntity: FeedBackEntity = {
        id: includeId
          ? feedBackData.id
            ? feedBackData.id
            : undefined
          : feedBackData.id,
        fromRealtorId: feedBackData.fromRealtorId,
        toRealtorId: feedBackData.toRealtorId,
        jobId: feedBackData.jobId,
        rating: feedBackData.rating,
        description: feedBackData.description,
        fromRealtorData: feedBackData.fromRealtorData,
        toRealtorData: feedBackData.toRealtorData,
        jobData: feedBackData.jobData,
      };
      return feedBackData;
    }
  }

  static toModel(feedBack: FeedBackEntity): any {
    return {
      fromRealtorId: feedBack.fromRealtorId,
      toRealtorId: feedBack.toRealtorId,
      jobId: feedBack.jobId,
      rating: feedBack.rating,
      description: feedBack.description,
      fromRealtorData: feedBack.fromRealtorData,
      toRealtorData: feedBack.toRealtorData,
      jobData: feedBack.jobData,
    };
  }
}
