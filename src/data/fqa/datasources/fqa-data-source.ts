import { FQAModel } from "@domain/fqa/entities/fqa";
import FQA from "../model/fqa-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize"


export interface FQADataSource {
  create(fqa: FQAModel): Promise<any>; // Return type should be Promise of FQAEntity
  getAllFQAs(): Promise<any[]>; // Return type should be Promise of an array of FQAEntity
  read(id: string): Promise<any | null>; // Return type should be Promise of FQAEntity or null
  update(id: string, fqa: FQAModel): Promise<any>; // Return type should be Promise of FQAEntity
  delete(id: string): Promise<void>;
}

// FQA Data Source communicates with the database
export class FQADataSourceImpl implements FQADataSource {
  constructor(private db: Sequelize) { }

  async create(fqa: any): Promise<any> {
      console.log(fqa, "datasouce-20");
      
      const createdFQA = await FQA.create(fqa);
      return createdFQA.toJSON();
  }

  async getAllFQAs(): Promise<any[]> {
      const fqa = await FQA.findAll({});
      return fqa.map((fqa: any) => fqa.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async read(id: string): Promise<any | null> {
      const fqa = await FQA.findOne({
          where: {
              id: id,
          },
          // include: 'tags', // Replace 'tags' with the actual name of your association
      });
      return fqa ? fqa.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async update(id: string, updatedData: FQAModel): Promise<any> {
      // Find the record by ID
      const fqa = await FQA.findByPk(id);


      // Update the record with the provided data
      if (fqa) {
          await fqa.update(updatedData);
      }
      // Fetch the updated record
      const updatedFQA = await FQA.findByPk(id);

      return updatedFQA ? updatedFQA.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
      await FQA.destroy({
          where: {
              id: id,
          },
      });
  }
}

