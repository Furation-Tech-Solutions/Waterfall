import { FQAModel } from "@domain/fqa/entities/fqa";
import FQA from "../model/fqa-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize"


export interface FQADataSource {
  create(fqa: FQAModel): Promise<any>; // Return type should be Promise of FQAEntity
  getAllFQAs(): Promise<any[]>; // Return type should be Promise of an array of FQAEntity
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
}

