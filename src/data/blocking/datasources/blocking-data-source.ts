// Import necessary modules and classes
import {
  BlockingModel,
  BlockingEntity,
} from "@domain/blocking/entities/blocking";
import Blocking from "../model/blocking-model";
import ApiError from "@presentation/error-handling/api-error";
import { Op, Sequelize } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";
import Connections from "@data/connections/models/connections_model";
import { AnyCnameRecord } from "dns";

// Define an interface for the BlockingDataSource
export interface BlockingDataSource {
  // Method to create a new blocking entry
  create(blocking: any): Promise<BlockingEntity>; // Promise of BlockingEntity

  // Method to retrieve all blocking entries
  getAllBlockings(query: BlockQuery): Promise<BlockingEntity[]>; // Promise of an array of BlockingEntity

  // Method to read a blocking entry by ID
  read(id: string): Promise<BlockingEntity>; // Promise of BlockingEntity or null

  // Method to check if a user is blocked
  isBlocked(id: string, blockingId: string): Promise<BlockingEntity>;

  // Method to update a blocking entry by ID
  update(
    id: string,
    blocking: BlockingModel
  ): Promise<BlockingEntity>; // Promise of BlockingEntity

  // Method to delete a blocking entry by ID
  delete(id: string): Promise<void>;
}

// Define a BlockQuery object to encapsulate parameters
export interface BlockQuery {
  id: number;
  page: number;
  limit: number;
}

// Blocking Data Source communicates with the database
export class BlockingDataSourceImpl implements BlockingDataSource {
  constructor(private db: Sequelize) { }

  async create(blocking: any): Promise<BlockingEntity> {
    // Check if there is an existing connection between the users
    const existingConnection = (await Connections.findOne({
      where: {
        [Op.or]: [
          {
            fromId: blocking.fromRealtorId,
            toId: blocking.toRealtorId,
          },
          {
            fromId: blocking.toRealtorId,
            toId: blocking.fromRealtorId,
          },
        ],
      },
    })) as any;

    if (existingConnection) {
      // Connection exists, delete it before creating the blocking entry
      await Connections.destroy({
        where: {
          id: existingConnection.id,
        },
      });
    }

    // Create a new blocking entry
    const createdBlocking = await Blocking.create(blocking);
    return createdBlocking.toJSON();
  }

  // Method to retrieve all blocking entries
  async getAllBlockings(query: BlockQuery): Promise<BlockingEntity[]> {
    let loginId = query.id;
    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page
    const offset = (currentPage - 1) * itemsPerPage;

    // Fetch all blocking entries from the database
    const data = await Blocking.findAll({
      where: {
        fromRealtorId: loginId,
      },
      include: [
        {
          model: Realtors,
          as: "fromRealtorData", // Alias for the first association
          foreignKey: "fromRealtorId",
        },
        {
          model: Realtors,
          as: "toRealtorData", // Alias for the second association
          foreignKey: "toRealtorId",
        },
      ],
      limit: itemsPerPage, // Limit the number of results per page
      offset: offset, // Calculate the offset based on the current page
    });

    // Convert the Sequelize model instances to plain JavaScript objects before returning
    return data.map((blocking: any) => blocking.toJSON());
  }

  // Method to read a blocking entry by ID
  async read(id: string): Promise<BlockingEntity> {
    // Find a blocking entry by its ID
    const blocking = await Blocking.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          as: "fromRealtorData",
          foreignKey: "fromRealtorId",
        },
        {
          model: Realtors,
          as: "toRealtorData",
          foreignKey: "toRealtorId",
        },
      ],
    });
    if (blocking === null) {
      throw ApiError.notFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return blocking.toJSON();
  }

  // Method to check if a user is blocked
  async isBlocked(id: string, blockingId: string): Promise<BlockingEntity> {

    const blocking = await Blocking.findOne({
      where: {
        fromRealtorId: id,
        toRealtorId: blockingId,
      },
    });
    if (blocking === null) {
      throw ApiError.notFound();
    }
    return blocking.toJSON();
  }

  // Method to update a blocking entry by ID
  async update(
    id: string,
    updatedData: BlockingModel
  ): Promise<BlockingEntity> {
    // Find the blocking entry by ID
    const blocking = await Blocking.findByPk(id);

    // Update the blocking entry with the provided data if it exists
    if (blocking) {
      await blocking.update(updatedData);
    }

    // Fetch the updated blocking entry and convert it to a plain JavaScript object before returning
    const updatedBlocking = await Blocking.findByPk(id);
    if (updatedBlocking == null) {
      throw ApiError.notFound();
    }
    return updatedBlocking.toJSON();
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
