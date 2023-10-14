// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import {
  NotInterestedEntity,
  NotInterestedModel,
} from "@domain/notInterested/entities/notInterested";
import NotInterested from "@data/notInterested/models/notInterested-models";

// Create a NotInterestedDataSource Interface
export interface NotInterestedDataSource {
  // Define methods for data source operations
  create(notInterested: NotInterestedModel): Promise<NotInterestedEntity>;
  update(id: string, notInterested: NotInterestedModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<NotInterestedEntity | null>;
  getAll(): Promise<NotInterestedEntity[]>;
}

// Implement the NotInterested Data Source that communicates with the database
export class NotInterestedDataSourceImpl implements NotInterestedDataSource {
  constructor(private db: Sequelize) {}

  // Implement the "create" method to insert a new NotInterestedModel into the database
  async create(notInterested: any): Promise<NotInterestedEntity> {
    const createdNotInterested = await NotInterested.create(notInterested);

    // Return the created NotInterested as a plain JavaScript object
    return createdNotInterested.toJSON();
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
      // include: 'tags', // You can include associations here if needed
    });
    return notInterested ? notInterested.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Implement the "getAll" method to retrieve all NotInterestedEntity records from the database
  async getAll(): Promise<NotInterestedEntity[]> {
    const notInteresteds = await NotInterested.findAll({});
    return notInteresteds.map((notInterested: any) => notInterested.toJSON()); // Convert to plain JavaScript objects before returning
  }

  // Implement the "update" method to update a NotInterested record by ID with provided data
  async update(id: string, updatedData: NotInterestedModel): Promise<any> {
    // Find the record by ID
    const notInterested = await NotInterested.findByPk(id);

    // Update the record with the provided data if it exists
    if (notInterested) {
      await notInterested.update(updatedData);
    }

    // Fetch the updated record
    const updatedNotInterested = await NotInterested.findByPk(id);

    return updatedNotInterested ? updatedNotInterested.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}
