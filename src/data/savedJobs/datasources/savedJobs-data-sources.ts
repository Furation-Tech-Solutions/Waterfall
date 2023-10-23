// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import {
  SavedJobEntity,
  SavedJobModel,
} from "@domain/savedJobs/entities/savedJobs";
import SavedJob from "@data/savedJobs/models/savedJobs-models";
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";

// Create a SavedJobDataSource Interface
export interface SavedJobDataSource {
  // Define methods for data source operations
  create(savedJob: SavedJobModel): Promise<SavedJobEntity>;
  update(id: string, savedJob: SavedJobModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<SavedJobEntity | null>;
  getAll(): Promise<SavedJobEntity[]>;
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
      // include: 'tags', // You can include associations here if needed
    });
    return savedJob ? savedJob.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Implement the "getAll" method to retrieve all SavedJobEntity records from the database
  async getAll(): Promise<SavedJobEntity[]> {
    const savedJobs = await SavedJob.findAll({
      include: [
        {
          model: Realtors,
          as: "realtorData",
          foreignKey: "Realtor",
        },
        {
          model: Job,
          as: "jobData",
          foreignKey: "Job",
        },
      ],
    });
    return savedJobs.map((savedJob: any) => savedJob.toJSON()); // Convert to plain JavaScript objects before returning
  }

  // Implement the "update" method to update a SavedJob record by ID with provided data
  async update(id: string, updatedData: SavedJobModel): Promise<any> {
    // Find the record by ID
    const savedJob = await SavedJob.findByPk(id);

    // Update the record with the provided data if it exists
    if (savedJob) {
      await savedJob.update(updatedData);
    }

    // Fetch the updated record
    const updatedSavedJob = await SavedJob.findByPk(id);

    return updatedSavedJob ? updatedSavedJob.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}
