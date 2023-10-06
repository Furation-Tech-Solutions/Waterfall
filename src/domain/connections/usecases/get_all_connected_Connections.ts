// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

// Define the interface for the GetAllConnections use case
export interface GetAllConnectedConnectionsUsecase {
  // Method to fetch all connections
  execute: () => Promise<Either<ErrorClass, ConnectionsEntity[]>>;
}

// Implement the GetAllConnections use case
export class GetAllConnedctedConnetions implements GetAllConnectedConnectionsUsecase {
  private readonly connectionsRepository: ConnectionsRepository;

  // Constructor to initialize the ConnectionsRepository
  constructor(connectionsRepository: ConnectionsRepository) {
    this.connectionsRepository = connectionsRepository;
  }

  // Implementation of the execute method
  // This method retrieves all connections and returns a Promise with an Either result
  async execute(): Promise<Either<ErrorClass, ConnectionsEntity[]>> {
    // Delegate the retrieval of all connections to the ConnectionsRepository
    return await this.connectionsRepository.getAllConnectedConnections();
  }
}
