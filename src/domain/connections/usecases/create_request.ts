// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

// Define the interface for the CreateConnections use case
export interface CreateRequestUsecase {
    execute: (connectionsData: ConnectionsModel) => Promise<Either<ErrorClass, ConnectionsEntity>>;
}

// Implement the CreateConnections use case
export class CreateRequest implements CreateRequestUsecase {
    private readonly connectionsRepository: ConnectionsRepository;

    // Constructor to initialize the ConnectionsRepository
    constructor(connectionsRepository: ConnectionsRepository) {
        this.connectionsRepository = connectionsRepository;
    }

    // Implementation of the execute method
    // This method takes ConnectionsModel data and returns a Promise with an Either result
    async execute(connectionsData: ConnectionsModel): Promise<Either<ErrorClass, ConnectionsEntity>> {
        // Delegate the creation of connections to the ConnectionsRepository
        return await this.connectionsRepository.createRequest(connectionsData);
    }
}
