// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

// Define the interface for the DeleteConnections use case
export interface DeleteConnectionsUsecase {
    execute: (id: string) => Promise<Either<ErrorClass, void>>;
}

// Implement the DeleteConnections use case
export class DeleteConnections implements DeleteConnectionsUsecase {
    private readonly connectionsRepository: ConnectionsRepository;

    // Constructor to initialize the ConnectionsRepository
    constructor(connectionsRepository: ConnectionsRepository) {
        this.connectionsRepository = connectionsRepository;
    }

    // Implementation of the execute method
    // This method takes an ID and returns a Promise with an Either result
    async execute(id: string): Promise<Either<ErrorClass, void>> {
        // Delegate the deletion of connections to the ConnectionsRepository
        return await this.connectionsRepository.deleteConnections(id);
    }
}
