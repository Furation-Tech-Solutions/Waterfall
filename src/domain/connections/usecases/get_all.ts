// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

// Define the interface for the GetAllConnections use case
export interface GetAllUsecase {
  // Method to fetch all connections
  execute: (fromId: string, toId: string) => Promise<Either<ErrorClass, ConnectionsEntity[]>>;
}

// Implement the GetAllConnections use case
export class GetAll implements GetAllUsecase {
  private readonly connectionsRepository: ConnectionsRepository;

  // Constructor to initialize the ConnectionsRepository
  constructor(connectionsRepository: ConnectionsRepository) {
    this.connectionsRepository = connectionsRepository;
  }

  // Implementation of the execute method
  // This method retrieves all connections and returns a Promise with an Either result
  async execute(fromId: string, toId: string): Promise<Either<ErrorClass, ConnectionsEntity[]>> {
    // Delegate the retrieval of all connections to the ConnectionsRepository
    return await this.connectionsRepository.getAll(fromId, toId);
  }
}
