import { Sequelize } from "sequelize";
import { SavedJobEntity, SavedJobModel } from "@domain/savedJobs/entities/savedJobs"; // Import the JobModel
import SavedJob from "@data/savedJobs/models/savedJobs-models";

// Create SavedJobDataSource Interface
export interface SavedJobDataSource {
  create(savedJob: SavedJobModel): Promise<SavedJobEntity>;
  update(id: string, savedJob: SavedJobModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<SavedJobEntity | null>;
  getAll(): Promise<SavedJobEntity[]>;
}

// SavedJob Data Source communicates with the database
export class SavedJobDataSourceImpl implements SavedJobDataSource {
  constructor(private db: Sequelize) {}

  async create(savedJob: any): Promise<SavedJobEntity> {
    const createdSavedJob = await SavedJob.create(savedJob);

    return createdSavedJob.toJSON();
  }

  async delete(id: string): Promise<void> {
    await SavedJob.destroy({
      where: {
        id: id,
      },
    });
  }

  async read(id: string): Promise<SavedJobEntity | null> {
    const savedJob = await SavedJob.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return savedJob ? savedJob.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<SavedJobEntity[]> {
    const savedJob = await SavedJob.findAll({});
    return savedJob.map((savedJob: any) => savedJob.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: SavedJobModel): Promise<any> {
    // Find the record by ID
    const savedJob = await SavedJob.findByPk(id);

    // Update the record with the provided data
    if (savedJob) {
      await savedJob.update(updatedData);
    }
    // Fetch the updated record
    const updatedSavedJob = await SavedJob.findByPk(id);

    return updatedSavedJob ? updatedSavedJob.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}

