import { BlockingModel } from "@domain/blocking/entities/blocking";
import Blocking from "../model/blocking-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize"


export interface BlockingDataSource {
  create(blocking: BlockingModel): Promise<any>; // Return type should be Promise of BlockingEntity
    getAllBlockings(): Promise<any[]>; // Return type should be Promise of an array of BlockingEntity
    read(id: string): Promise<any | null>; // Return type should be Promise of BlockingEntity or null
    update(id: string, blocking: BlockingModel): Promise<any>; // Return type should be Promise of BlockingEntity
    delete(id: string): Promise<void>;
}

// Blocking Data Source communicates with the database
export class BlockingDataSourceImpl implements BlockingDataSource {
  constructor(private db: Sequelize) { }

  async create(blocking: any): Promise<any> {
      console.log(blocking, "datasouce-20");
        const existingBlockor = await Blocking.findOne({
            where: {
                fromRealtor: blocking.fromRealtor,
                toRealtor: blocking.toRealtor
            }
        });
        console.log(existingBlockor, "datasouce-26");
        if (existingBlockor) {
            throw ApiError.idBlocked();
        }
      const createdBlocking = await Blocking.create(blocking);
      return createdBlocking.toJSON();
  }

  async getAllBlockings(): Promise<any[]> {
      const blocking = await Blocking.findAll({});
      return blocking.map((blocking: any) => blocking.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async read(id: string): Promise<any | null> {
      const blocking = await Blocking.findOne({
          where: {
              id: id,
          },
          // include: 'tags', // Replace 'tags' with the actual name of your association
      });
      return blocking ? blocking.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async update(id: string, updatedData: BlockingModel): Promise<any> {
      // Find the record by ID
      const blocking = await Blocking.findByPk(id);


      // Update the record with the provided data
      if (blocking) {
          await blocking.update(updatedData);
      }
      // Fetch the updated record
      const updatedBlocking = await Blocking.findByPk(id);

      return updatedBlocking ? updatedBlocking.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async delete(id: string): Promise<void> {
      await Blocking.destroy({
          where: {
              id: id,
          },
      });
  }
}

