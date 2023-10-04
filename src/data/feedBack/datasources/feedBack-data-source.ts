import { FeedBackModel } from "@domain/feedBack/entities/feedBack";
import FeedBack from "../model/feedBack-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize"


export interface FeedBackDataSource {
  create(feedBack: FeedBackModel): Promise<any>; // Return type should be Promise of FeedBackEntity
}

// FeedBack Data Source communicates with the database
export class FeedBackDataSourceImpl implements FeedBackDataSource {
  constructor(private db: Sequelize) { }

  async create(feedBack: any): Promise<any> {
      console.log(feedBack, "datasouce-20");
      
      const createdFeedBack = await FeedBack.create(feedBack);
      return createdFeedBack.toJSON();
  }
}

