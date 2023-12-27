import { FeedBackEntity, FeedBackModel } from "@domain/feedBack/entities/feedBack";
import FeedBack from "../model/feedBack-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";
import Jobs from "@data/job/models/job-model";

// Define the structure of the query parameters
export interface Query {
  id?: string;
  q?: string;
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

// Define the interface for the FeedBackDataSource
export interface FeedBackDataSource {
  create(feedBack: any): Promise<FeedBackEntity>;
  getAllFeedBacks(query: Query): Promise<FeedBackEntity[]>;
  read(id: string): Promise<FeedBackEntity>;
  update(id: string, updatedData: any): Promise<FeedBackEntity>;
  delete(id: string): Promise<void>;
  count(query: Query): Promise<number>;
}

// Implementation of the FeedBackDataSource interface
export class FeedBackDataSourceImpl implements FeedBackDataSource {
  constructor(private db: Sequelize) { }

  // Create a new feedback entry
  async create(feedBack: any): Promise<FeedBackEntity> {
    const existingFeedBack = await FeedBack.findOne({
      where: {
        jobId: feedBack.jobId,
        fromRealtorId: feedBack.fromRealtorId, // Assuming these properties exist in the feedBack object
        toRealtorId: feedBack.toRealtorId
      },
    });

    if (existingFeedBack) {
      throw ApiError.feedBackGiven();
    }

    const createdFeedBack = await FeedBack.create(feedBack);
    return createdFeedBack.toJSON();
  }

  // Retrieve all feedback entries
  async getAllFeedBacks(query: Query): Promise<FeedBackEntity[]> {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const data = await FeedBack.findAll({
      where: {
        toRealtorId: query.id,
      },
      include: [
        { model: Realtors, as: "fromRealtorData", foreignKey: "fromRealtorId" },
        { model: Realtors, as: "toRealtorData", foreignKey: "toRealtorId" },
      ],
      // limit,
      // offset,
    });

    return data.map((feedBack: any) => feedBack.toJSON());
  }

  // Retrieve a feedback entry by its ID
  async read(id: string): Promise<FeedBackEntity> {
    const feedBack = await FeedBack.findOne({
      where: { id },
      include: [
        {
          model: Realtors,
          as: "fromRealtorData",
          foreignKey: "fromRealtorId",
        },
        { model: Realtors, as: "toRealtorData", foreignKey: "toRealtorId" },
        { model: Jobs, as: "jobData", foreignKey: "jobId" },
      ],
    });

    if (feedBack === null) {
      throw ApiError.notFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return feedBack.toJSON();
  }

  // Update a feedback entry by ID
  async update(
    id: string,
    updatedData: any
  ): Promise<FeedBackEntity> {
    const feedBack = await FeedBack.findByPk(id);

    if (feedBack) {
      await feedBack.update(updatedData);
    }

    const updatedFeedBack = await FeedBack.findByPk(id);
    if (updatedFeedBack == null) {
      throw ApiError.notFound();
    }
    return updatedFeedBack.toJSON();
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
