// Import necessary modules and classes
import { BlockingModel } from "@domain/blocking/entities/blocking";
import Blocking from "../model/blocking-model";
import ApiError from "@presentation/error-handling/api-error";
import { Sequelize } from "sequelize"

import Realtors from "@data/realtors/model/realtor-model";

// Define an interface for the BlockingDataSource
export interface BlockingDataSource {
  create(blocking: BlockingModel): Promise<any>; // Return type should be Promise of BlockingEntity
  getAllBlockings(): Promise<any[]>; // Return type should be Promise of an array of BlockingEntity
  read(id: string): Promise<any | null>; // Return type should be Promise of BlockingEntity or null
  update(id: string, blocking: BlockingModel): Promise<any>; // Return type should be Promise of BlockingEntity
  delete(id: string): Promise<void>;
}

// interface BlockingAttributes {
//     id: number;
//     fromRealtor: number;
//     toRealtor: number;
//   }

//   // Define the Blocking model
//   class Blocking extends Model<BlockingAttributes> implements BlockingAttributes {
//     public id!: number;
//     public fromRealtor!: number;
//     public toRealtor!: number;
//   }

// Blocking Data Source communicates with the database
export class BlockingDataSourceImpl implements BlockingDataSource {
  constructor(private db: Sequelize) { }

  // Method to create a new blocking entry
  async create(blocking: any): Promise<any> {
      console.log(blocking, "datasouce-20");
      
      // Check if a blocking entry with the same 'fromRealtor' and 'toRealtor' already exists
      const existingBlockor = await Blocking.findOne({
          where: {
              fromRealtor: blocking.fromRealtor,
              toRealtor: blocking.toRealtor
          }
      });
      console.log(existingBlockor, "datasouce-26");
      
      // If a matching entry exists, throw an error
      if (existingBlockor) {
          throw ApiError.idBlocked();
      }
      
      // Create a new blocking entry and return its JSON representation
      const createdBlocking = await Blocking.create(blocking);
      return createdBlocking.toJSON();
  }

  // Method to retrieve all blocking entries
  async getAllBlockings(): Promise<any[]> {
      // Fetch all blocking entries from the database
      const blocking = await Blocking.findAll({});
      
      // Convert the Sequelize model instances to plain JavaScript objects before returning
      return blocking.map((blocking: any) => blocking.toJSON());
  }
  
  
// async getAllBlockings(): Promise<any[]> {
//     try {
//       // Fetch all blocking entries from the database
//       const blockings = await Blocking.findAll({
//         include: [
//           {
//             model: Realtors, // Assuming you have a Realtors model defined
//             as: "fromRealtor", // Use the correct alias for the fromRealtor relationship
//           },
//           {
//             model: Realtors, // Assuming you have a Realtors model defined
//             as: "toRealtor", // Use the correct alias for the toRealtor relationship
//           },
//         ],
//       });
  
//       // Convert the Sequelize model instances to plain JavaScript objects before returning
//       const blockingData = blockings.map((blocking) => {
//         return {
//           id: blocking.id, // Access 'id' property from the model instance
//           fromRealtor: blocking.fromRealtor.toJSON(), // Call .toJSON() on the fromRealtor instance
//           toRealtor: blocking.toRealtor.toJSON(), // Call .toJSON() on the toRealtor instance
//         };
//       });
  
//       return blockingData;
//     } catch (error) {
//       // Handle any errors that may occur during the database query
//       console.error("Error fetching blocking entries:", error);
//       throw error; // You may want to handle the error more gracefully
//     }
//   }
  

  // Method to read a blocking entry by ID
  async read(id: string): Promise<any | null> {
      // Find a blocking entry by its ID
      const blocking = await Blocking.findOne({
          where: {
              id: id,
          },
          // include: 'tags', // You can uncomment this line if there are associations to include
      });
      
      // If a matching entry is found, convert it to a plain JavaScript object before returning
      return blocking ? blocking.toJSON() : null;
  }

  // Method to update a blocking entry by ID
  async update(id: string, updatedData: BlockingModel): Promise<any> {
      // Find the blocking entry by ID
      const blocking = await Blocking.findByPk(id);

      // Update the blocking entry with the provided data if it exists
      if (blocking) {
          await blocking.update(updatedData);
      }
      
      // Fetch the updated blocking entry and convert it to a plain JavaScript object before returning
      const updatedBlocking = await Blocking.findByPk(id);
      return updatedBlocking ? updatedBlocking.toJSON() : null;
  }

  // Method to delete a blocking entry by ID
  async delete(id: string): Promise<void> {
      // Delete the blocking entry from the database based on its ID
      await Blocking.destroy({
          where: {
              id: id,
          },
      });
  }
}
