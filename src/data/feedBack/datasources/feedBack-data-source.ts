import { FeedBackModel } from "@domain/feedBack/entities/feedBack";
import FeedBack from "../model/feedBack-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize"


export interface FeedBackDataSource {
  create(feedBack: FeedBackModel): Promise<any>; // Return type should be Promise of FeedBackEntity
  getAllFeedBacks(): Promise<any[]>; // Return type should be Promise of an array of FeedBackEntity
  read(id: string): Promise<any | null>; // Return type should be Promise of FeedBackEntity or null
  update(id: string, feedBack: FeedBackModel): Promise<any>; // Return type should be Promise of FeedBackEntity
}

// FeedBack Data Source communicates with the database
export class FeedBackDataSourceImpl implements FeedBackDataSource {
  constructor(private db: Sequelize) { }

  async create(feedBack: any): Promise<any> {
      console.log(feedBack, "datasouce-20");
      
      const createdFeedBack = await FeedBack.create(feedBack);
      return createdFeedBack.toJSON();
  }

  async getAllFeedBacks(): Promise<any[]> {
      const feedBack = await FeedBack.findAll({});
      return feedBack.map((feedBack: any) => feedBack.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async read(id: string): Promise<any | null> {
      const feedBack = await FeedBack.findOne({
          where: {
              id: id,
          },
          // include: 'tags', // Replace 'tags' with the actual name of your association
      });
      return feedBack ? feedBack.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async update(id: string, updatedData: FeedBackModel): Promise<any> {
      // Find the record by ID
      const feedBack = await FeedBack.findByPk(id);


      // Update the record with the provided data
      if (feedBack) {
          await feedBack.update(updatedData);
      }
      // Fetch the updated record
      const updatedFeedBack = await FeedBack.findByPk(id);

      return updatedFeedBack ? updatedFeedBack.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}

