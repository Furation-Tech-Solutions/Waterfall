import { Sequelize } from "sequelize";
import { SupportEntity, SupportModel } from "@domain/support/entities/support"; // Import the SupportModel
import Support from "..//models/support-model";

// Create SupportDataSource Interface
export interface SupportDataSource {
  create(support: SupportModel): Promise<SupportEntity>;
  update(id: string, support: SupportModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<SupportEntity | null>;
  getAll(): Promise<SupportEntity[]>;
}

// Support Data Source communicates with the database
export class SupportDataSourceImpl implements SupportDataSource {
  constructor(private db: Sequelize) {}

  async create(support: any): Promise<SupportEntity> {
    const createdSupport = await Support.create(support);

    return createdSupport.toJSON();
  }

  async delete(id: string): Promise<void> {
    await Support.destroy({
      where: {
        id: id,
      },
    });
  }

  async read(id: string): Promise<SupportEntity | null> {
    const support = await Support.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return support ? support.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<SupportEntity[]> {
    const support = await Support.findAll({});
    return support.map((support: any) => support.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: SupportModel): Promise<any> {
    // Find the record by ID
    const support = await Support.findByPk(id);

    // Update the record with the provided data
    if (support) {
      await support.update(updatedData);
    }
    // Fetch the updated record
    const updatedSupport = await Support.findByPk(id);

    return updatedSupport ? updatedSupport.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}
