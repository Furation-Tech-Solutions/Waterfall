import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

// Define the interface for the GetById use case
export interface CheckConnectionUsecase {
  execute: (id: string, loginId: string) => Promise<Either<ErrorClass, ConnectionsEntity>>;
}

// Implement the GetById use case
export class CheckConnection implements CheckConnectionUsecase {
  private readonly connectionsRepository: ConnectionsRepository;

  constructor(connectionsRepository: ConnectionsRepository) {
    this.connectionsRepository = connectionsRepository;
  }

  // Implementation of the execute method
  // This method retrieves a specific connection by fromId and toId and returns a Promise with an Either result
  async execute(id: string, loginId: string): Promise<Either<ErrorClass, ConnectionsEntity>> {
    // Delegate the retrieval of the specific connection to the ConnectionsRepository
    return await this.connectionsRepository.checkConnection(id, loginId);
  }
}
