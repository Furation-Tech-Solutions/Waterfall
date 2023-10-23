// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import { SupportEntity, SupportModel } from "@domain/support/entities/support"; // Import the SupportModel
import Support from "..//models/support-model"; // Import the Support model
import Realtors from "@data/realtors/model/realtor-model";

// Create SupportDataSource Interface
export interface SupportDataSource {
  // Define methods for data operations on Support entities
  create(support: SupportModel): Promise<SupportEntity>;
  update(id: string, support: SupportModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<SupportEntity | null>;
  getAll(): Promise<SupportEntity[]>;
}

// Support Data Source communicates with the database
export class SupportDataSourceImpl implements SupportDataSource {
  constructor(private db: Sequelize) {}

  // Implement the "create" method to insert a new SupportEntity
  async create(support: any): Promise<SupportEntity> {
    // Create a new SupportEntity record in the database
    const createdSupport = await Support.create(support);

    // Return the newly created SupportEntity as a plain JavaScript object
    return createdSupport.toJSON();
  }

  // Implement the "delete" method to remove a SupportEntity by ID
  async delete(id: string): Promise<void> {
    // Delete a SupportEntity record from the database based on its ID
    await Support.destroy({
      where: {
        id: id,
      },
    });
  }

  // Implement the "read" method to retrieve a SupportEntity by ID
  async read(id: string): Promise<SupportEntity | null> {
    // Find a SupportEntity record in the database by its ID
    const support = await Support.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // You can include associations here if needed
    });

    // Convert the SupportEntity to a plain JavaScript object before returning
    return support ? support.toJSON() : null;
  }

  // Implement the "getAll" method to retrieve all SupportEntity records
  async getAll(): Promise<SupportEntity[]> {
    // Retrieve all SupportEntity records from the database
    const support = await Support.findAll({
       include: [
        {
          model: Realtors,
          as: "realtorData",
          foreignKey: "realtor",
        },
       ]
    });

    // Convert the SupportEntities to plain JavaScript objects before returning
    return support.map((support: any) => support.toJSON());
  }

  // Implement the "update" method to update a SupportEntity by ID
  async update(id: string, updatedData: SupportModel): Promise<any> {
    // Find the SupportEntity record in the database by its ID
    const support = await Support.findByPk(id);

    // Update the SupportEntity record with the provided data
    if (support) {
      await support.update(updatedData);
    }

    // Fetch the updated SupportEntity record
    const updatedSupport = await Support.findByPk(id);

    // Convert the updated SupportEntity to a plain JavaScript object before returning
    return updatedSupport ? updatedSupport.toJSON() : null;
  }
}
