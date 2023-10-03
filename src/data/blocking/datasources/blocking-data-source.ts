import { BlockingModel } from "@domain/blocking/entities/blocking";
import Blocking from "../model/blocking-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize"


export interface BlockingDataSource {
  create(blocking: BlockingModel): Promise<any>; // Return type should be Promise of BlockingEntity
    getAllBlockings(): Promise<any[]>; // Return type should be Promise of an array of BlockingEntity
}

// Blocking Data Source communicates with the database
export class BlockingDataSourceImpl implements BlockingDataSource {
  constructor(private db: Sequelize) { }

  async create(blocking: any): Promise<any> {
      console.log(blocking, "datasouce-20");
      
      const createdBlocking = await Blocking.create(blocking);
      return createdBlocking.toJSON();
  }

    async getAllBlockings(): Promise<any[]> {
        const blocking = await Blocking.findAll({});
        return blocking.map((blocking: any) => blocking.toJSON()); // Convert to plain JavaScript objects before returning
    }
}

