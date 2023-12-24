// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import {
  NotInterestedEntity,
  NotInterestedModel,
} from "@domain/notInterested/entities/notInterested_entities";
import NotInterested from "@data/notInterested/model/notInterested-models";
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";
import ApiError from "@presentation/error-handling/api-error";

// Create a NotInterestedDataSource Interface
export interface NotInterestedDataSource {
  // Define methods for data source operations
  create(notInterested: any): Promise<NotInterestedEntity>;
  update(
    id: string,
    notInterested: any
  ): Promise<NotInterestedEntity>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<NotInterestedEntity | null>;
  getAll(query: NotInterestedQuery): Promise<NotInterestedEntity[]>;
}

// Define a NotInterestedQuery object to encapsulate parameters
export interface NotInterestedQuery {
  id: number;
  page: number;
  limit: number;
}

// Implement the NotInterested Data Source that communicates with the database
export class NotInterestedDataSourceImpl implements NotInterestedDataSource {
  constructor(private db: Sequelize) {}

  // Implement the "create" method to insert a new NotInterestedModel into the database
  async create(notInterested: any): Promise<NotInterestedEntity> {
    try {
      const createdNotInterested = await NotInterested.create(notInterested);

      // Return the created NotInterested as a plain JavaScript object
      return createdNotInterested.toJSON();
    } catch (error) {
      // Handle the error or log it for debugging
      throw new Error("Failed to create NotInterested");
    }
  }

  // Implement the "delete" method to remove a NotInterested record from the database by ID
  async delete(id: string): Promise<void> {
    await NotInterested.destroy({
      where: {
        id: id,
      },
    });
  }

  // Implement the "read" method to retrieve a NotInterestedEntity by its ID
  async read(id: string): Promise<NotInterestedEntity | null> {
    const notInterested = await NotInterested.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          as: "realtorData",
          foreignKey: "realtorId",
        },
        {
          model: Job,
          as: "jobData",
          foreignKey: "jobId",
        },
      ],
    });

    // Convert to a plain JavaScript object before returning
    return notInterested ? notInterested.toJSON() : null;
  }

  // Implement the "getAll" method to retrieve all NotInterestedEntity records from the database
  async getAll(query: NotInterestedQuery): Promise<NotInterestedEntity[]> {
    let loginId = query.id;
    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;

    const notInteresteds = await NotInterested.findAll({
      include: [
        {
          model: Realtors,
          as: "realtorData",
          foreignKey: "realtorId",
          where: {
            realtorId: loginId,
          },
        },
        {
          model: Job,
          as: "jobData",
          foreignKey: "jobId",
        },
      ],
      limit: itemsPerPage, // Limit the number of results per page
      offset: offset, // Calculate the offset based on the current page
    });

    // Convert to plain JavaScript objects before returning
    return notInteresteds.map((notInterested: any) => notInterested.toJSON());
  }

  // Implement the "update" method to update a NotInterested record by ID with provided data
  async update(
    id: string,
    updatedData: any
  ): Promise<NotInterestedEntity> {
    // Find the record by ID
    const notInterested = await NotInterested.findByPk(id);

    // Update the record with the provided data if it exists
    if (notInterested) {
      await notInterested.update(updatedData);
    }

    // Fetch the updated record
    const updatedNotInterested = await NotInterested.findByPk(id);

    if (updatedNotInterested == null) {
      throw ApiError.notFound();
    }
    return updatedNotInterested.toJSON();
  }
}

