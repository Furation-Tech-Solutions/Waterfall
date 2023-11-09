// Import necessary modules and dependencies
import { FeedBackModel } from "@domain/feedBack/entities/feedBack";
import FeedBack from "../model/feedBack-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";
import Jobs from "@data/job/models/job-model";


export interface Query {
  id?: number;
  q?: string;
  page?: number;
  limit?: number;
  year?: number; // Optional year
  month?: number;
}

// Define the interface for the FeedBackDataSource
export interface FeedBackDataSource {
  create(feedBack: any): Promise<any>; // Return type should be Promise of FeedBackEntity
  getAllFeedBacks(query: Query): Promise<any[]>; // Return type should be Promise of an array of FeedBackEntity
  read(id: string): Promise<any | null>; // Return type should be Promise of FeedBackEntity or null
  update(id: string, updatedData: FeedBackModel): Promise<any>; // Return type should be Promise of FeedBackEntity
  delete(id: string): Promise<void>;
  Count(query: Query): Promise<number>;
}

// Define a FeebackQuery object to encapsulate parameters

// FeedBack Data Source communicates with the database
export class FeedBackDataSourceImpl implements FeedBackDataSource {
  constructor(private db: Sequelize) { }

  // Create a new feedback entry
  async create(feedBack: any): Promise<any> {
    const existingFeedBack = await FeedBack.findOne({
      where: {
        jobId: feedBack.jobId,
      },
    });
    if (existingFeedBack) {
      throw ApiError.feedBackGiven();
    }

    const createdFeedBack = await FeedBack.create(feedBack);
    return createdFeedBack.toJSON();
  }

  // Retrieve all feedback entries
  async getAllFeedBacks(query: Query): Promise<any[]> {
    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page

    const offset = (currentPage - 1) * itemsPerPage;
    const data = await FeedBack.findAll({
      include: [
        {
          model: Realtors,
          as: "fromRealtorData", // Alias for the first association
          foreignKey: "fromRealtor",
        },
        {
          model: Realtors,
          as: "toRealtorData", // Alias for the second association
          foreignKey: "toRealtor",
        },
        // {
        //     model: Jobs,
        //     as: 'job', // Alias for the third association
        //     foreignKey: 'jobId',
        // },
      ],
      limit: itemsPerPage, // Limit the number of results per page
      offset: offset, // Calculate the offset based on the current page
    });
    return data.map((feedBack: any) => feedBack.toJSON()); // Convert to plain JavaScript objects before returning
  }

  // Retrieve a feedback entry by its ID
  async read(id: string): Promise<any | null> {
    const feedBack = await FeedBack.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          as: "fromRealtorData", // Alias for the first association
          foreignKey: "fromRealtor",
        },
        {
          model: Realtors,
          as: "toRealtorData", // Alias for the second association
          foreignKey: "toRealtor",
        },
        {
          model: Jobs,
          as: "JobData", // Alias for the third association
          foreignKey: "jobId",
        },
      ],
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return feedBack ? feedBack.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Update a feedback entry by ID
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

  // Delete a feedback entry by ID
  async delete(id: string): Promise<void> {
    await FeedBack.destroy({
      where: {
        id: id,
      },
    });
  }

  async Count(query: Query): Promise<number> {

    let loginId = query.id;

    const currentPage = query.page || 1; // Default to page 1

    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;
    if (query.q === "owner") {
      const count = await FeedBack.count({
        where: {
          fromRealtor: loginId,
        },
      });
      return count;
    }
    else if (query.q === "applicant") {
      const count = await FeedBack.count({
        where: {
          toRealtor: loginId,
        },
      });
      return count;
    }
    else {
      return 0;
    }
  }

}
