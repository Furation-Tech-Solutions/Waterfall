import { FeedBackModel } from "@domain/feedBack/entities/feedBack";
import FeedBack from "../model/feedBack-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";
import Jobs from "@data/job/models/job-model";

// Define the structure of the query parameters
export interface Query {
  id?: number;
  q?: string;
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

// Define the interface for the FeedBackDataSource
export interface FeedBackDataSource {
  create(feedBack: any): Promise<any>;
  getAllFeedBacks(query: Query): Promise<any[]>;
  read(id: string): Promise<any | null>;
  update(id: string, updatedData: FeedBackModel): Promise<any>;
  delete(id: string): Promise<void>;
  count(query: Query): Promise<number>;
}

// Implementation of the FeedBackDataSource interface
export class FeedBackDataSourceImpl implements FeedBackDataSource {
  constructor(private db: Sequelize) { }

  // Create a new feedback entry
  async create(feedBack: any): Promise<any> {
    const existingFeedBack = await FeedBack.findOne({ where: { jobId: feedBack.jobId } });

    if (existingFeedBack) {
      throw ApiError.feedBackGiven();
    }

    const createdFeedBack = await FeedBack.create(feedBack);
    return createdFeedBack.toJSON();
  }

  // Retrieve all feedback entries
  async getAllFeedBacks(query: Query): Promise<any[]> {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const data = await FeedBack.findAll({
      include: [
        { model: Realtors, as: "fromRealtorData", foreignKey: "fromRealtor" },
        { model: Realtors, as: "toRealtorData", foreignKey: "toRealtor" },
      ],
      // limit,
      // offset,
    });

    return data.map((feedBack: any) => feedBack.toJSON());
  }

  // Retrieve a feedback entry by its ID
  async read(id: string): Promise<any | null> {
    const feedBack = await FeedBack.findOne({
      where: { id },
      include: [
        { model: Realtors, as: "fromRealtorData", foreignKey: "fromRealtor" },
        { model: Realtors, as: "toRealtorData", foreignKey: "toRealtor" },
        { model: Jobs, as: "JobData", foreignKey: "jobId" },
      ],
    });

    return feedBack ? feedBack.toJSON() : null;
  }

  // Update a feedback entry by ID
  async update(id: string, updatedData: FeedBackModel): Promise<any> {
    const feedBack = await FeedBack.findByPk(id);

    if (feedBack) {
      await feedBack.update(updatedData);
    }

    const updatedFeedBack = await FeedBack.findByPk(id);
    return updatedFeedBack ? updatedFeedBack.toJSON() : null;
  }

  // Delete a feedback entry by ID
  async delete(id: string): Promise<void> {
    await FeedBack.destroy({ where: { id } });
  }

  // Count the number of feedback entries based on query parameters
  async count(query: Query): Promise<number> {
    const { id, page = 1, limit = 10, q } = query;

    if (q === "owner") {
      return FeedBack.count({ where: { fromRealtor: id } });
    } else if (q === "applicant") {
      return FeedBack.count({ where: { toRealtor: id } });
    }

    return 0;
  }
}
