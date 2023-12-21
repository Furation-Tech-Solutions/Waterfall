// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import {
  SavedJobEntity,
  SavedJobModel,
} from "@domain/savedJobs/entities/savedJobs";
import SavedJob from "@data/savedJobs/models/savedJobs-models";
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";
import ApiError from "@presentation/error-handling/api-error";

// Create a SavedJobDataSource Interface
export interface SavedJobDataSource {
  // Define methods for data source operations

  // Method to create a new SavedJobModel in the database
  create(savedJob: any): Promise<SavedJobEntity>;

  // Method to update a SavedJobModel in the database by ID
  update(id: string, savedJob: any): Promise<SavedJobEntity>;

  // Method to delete a SavedJobModel from the database by ID
  delete(id: string): Promise<void>;

  // Method to read a SavedJobEntity from the database by ID
  read(id: string): Promise<SavedJobEntity | null>;

  // Method to get all SavedJobEntity records from the database based on a query
  getAll(query: SavedJobQuery): Promise<SavedJobEntity[]>;
}

// Define a SavedJobQuery object to encapsulate parameters
export interface SavedJobQuery {
  id: number;
  page: number;
  limit: number;
}

// Implement the SavedJob Data Source that communicates with the database
export class SavedJobDataSourceImpl implements SavedJobDataSource {
  constructor(private db: Sequelize) {}

  // Implement the "create" method to insert a new SavedJobModel into the database
  async create(savedJob: any): Promise<SavedJobEntity> {
    const createdSavedJob = await SavedJob.create(savedJob);

    // Return the created SavedJob as a plain JavaScript object
    return createdSavedJob.toJSON();
  }

  // Implement the "delete" method to remove a SavedJob record from the database by ID
  async delete(id: string): Promise<void> {
    await SavedJob.destroy({
      where: {
        id: id,
      },
    });
  }

  // Implement the "read" method to retrieve a SavedJobEntity by its ID
  async read(id: string): Promise<SavedJobEntity | null> {
    const savedJob = await SavedJob.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          foreignKey: "realtorId",
          as: "realtorData",
        },
        {
          model: Job,
          foreignKey: "jobId",
          as: "jobData",
        },
      ],
    });
    return savedJob ? savedJob.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Implement the "getAll" method to retrieve all SavedJobEntity records from the database
  async getAll(query: SavedJobQuery): Promise<SavedJobEntity[]> {
    let loginId = query.id;
    // Default to page 1 and 10 items per page if not specified in the query
    const currentPage = query.page || 1;
    const itemsPerPage = query.limit || 10;

    // Calculate the offset based on the current page
    const offset = (currentPage - 1) * itemsPerPage;

    // Retrieve SavedJobEntity records from the database with associations
    const savedJobs = await SavedJob.findAll({
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
    return savedJobs.map((savedJob: any) => savedJob.toJSON());
  }

  // Implement the "update" method to update a SavedJob record by ID with provided data
  async update(id: string, updatedData: any): Promise<SavedJobEntity> {
    // Find the record by ID
    const savedJob = await SavedJob.findByPk(id);

    // Update the record with the provided data if it exists
    if (savedJob) {
      await savedJob.update(updatedData);
    }

    // Fetch the updated record
    const updatedSavedJob = await SavedJob.findByPk(id);

    if (updatedSavedJob == null) {
      throw ApiError.notFound();
    }
    return updatedSavedJob.toJSON();
  }
}
