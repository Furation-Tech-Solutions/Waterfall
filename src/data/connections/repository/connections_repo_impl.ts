// Import necessary modules and dependencies
import {
  ConnectionsEntity,
  ConnectionsModel,
} from "@domain/connections/entities/connections_entities"; // Import the ConnectionsModel
import { ConnectionsRepository } from "@domain/connections/repositories/connections_repo"; // Import the ConnectionsRepository
import {
  ConnectionsDataSource,
  Query,
} from "../datasource/connections_datasource"; // Import the ConnectionsDataSource
import { Either, Right, Left } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { string } from "joi";

// Define a class implementing the ConnectionsRepository interface
export class ConnectionsRepositoryImpl implements ConnectionsRepository {
  // Private property to store the ConnectionsDataSource instance
  private readonly connectionsDataSource: ConnectionsDataSource;

  // Constructor to initialize the ConnectionsDataSource instance
  constructor(connectionsDataSource: ConnectionsDataSource) {
    this.connectionsDataSource = connectionsDataSource;
  }

  // Method to create a new connection
  async createRequest(
    data: ConnectionsModel
  ): Promise<Either<ErrorClass, ConnectionsEntity>> {
    try {
      // Use the ConnectionsDataSource to create a new connection
      const createdConnections = await this.connectionsDataSource.createReq(
        data
      );

      // Return a Right with the created connection entity
      return Right<ErrorClass, ConnectionsEntity>(createdConnections);
    } catch (error: any) {
      // Handle errors, return Left with appropriate ApiError
      if (error instanceof ApiError && error.name === "conflict") {
        return Left<ErrorClass, ConnectionsEntity>(ApiError.connectionExist());
      }
      return Left<ErrorClass, ConnectionsEntity>(
        ApiError.customError(400, error.message)
      );
    }
  }

  // Method to delete a connection
  async deleteRequest(
    id: string
  ): Promise<Either<ErrorClass, void>> {
    try {
      // Use the ConnectionsDataSource to delete a connection
      const result = await this.connectionsDataSource.deleteReq(id);

      // Return a Right if deletion was successful
      return Right<ErrorClass, void>(result);
    } catch (e) {
      // Handle errors, return Left with appropriate ApiError
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, void>(ApiError.notFound());
      }
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  // Method to update a connection
  async updateRequest(
    id: string,
    data: ConnectionsModel
  ): Promise<Either<ErrorClass, ConnectionsEntity>> {
    try {
      // Use the ConnectionsDataSource to update a connection
      const updatedConnections = await this.connectionsDataSource.updateReq(
        id,
        data
      );

      // Return a Right with the updated connection entity
      return Right<ErrorClass, ConnectionsEntity>(updatedConnections);
    } catch (e) {
      // Handle errors, return Left with appropriate ApiError
      if (e instanceof ApiError && e.name === "conflict") {
        return Left<ErrorClass, ConnectionsEntity>(ApiError.connectionExist());
      }
      return Left<ErrorClass, ConnectionsEntity>(ApiError.badRequest());
    }
  }

  // Method to get all connections
  async getAll(
    loginId: string,
    query: Query
  ): Promise<Either<ErrorClass, ConnectionsEntity[]>> {
    try {
      // Use the ConnectionsDataSource to get all connections
      const connections = await this.connectionsDataSource.getAll(
        loginId,
        query
      );

      // Return a Right with an array of connection entities
      return Right<ErrorClass, ConnectionsEntity[]>(connections);
    } catch (e) {
      // Handle errors, return Left with appropriate ApiError
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, ConnectionsEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, ConnectionsEntity[]>(ApiError.badRequest());
    }
  }

  // Method to get a connection by ID
  async getById(
    id: string
  ): Promise<Either<ErrorClass, ConnectionsEntity>> {
    try {
      // Use the ConnectionsDataSource to get a connection by ID
      const connections = await this.connectionsDataSource.read(id);

      // Return a Right with the connection entity if found, else return Left with notFound ApiError
      return connections
        ? Right<ErrorClass, ConnectionsEntity>(connections)
        : Left<ErrorClass, ConnectionsEntity>(ApiError.notFound());
    } catch (e) {
      // Handle errors, return Left with appropriate ApiError
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, ConnectionsEntity>(ApiError.notFound());
      }
      return Left<ErrorClass, ConnectionsEntity>(ApiError.badRequest());
    }
  }
}
