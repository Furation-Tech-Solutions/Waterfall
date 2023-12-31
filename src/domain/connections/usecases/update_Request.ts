import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

// Define the interface for the UpdateRequest use case
export interface UpdateRequestUsecase {
  execute: (
    id: string,
    loginId: string,
    data: ConnectionsEntity // Corrected 'Data' to 'data' for parameter naming consistency
  ) => Promise<Either<ErrorClass, ConnectionsEntity>>;
}

// Implement the UpdateRequest use case
export class UpdateRequest implements UpdateRequestUsecase {
  private readonly connectionsRepository: ConnectionsRepository;

  constructor(connectionsRepository: ConnectionsRepository) {
    this.connectionsRepository = connectionsRepository;
  }

  // Implementation of the execute method
  // This method updates a specific connection by fromId and toId with the given data and returns a Promise with an Either result
  async execute(
    id: string,
    loginId: string,
    data: ConnectionsEntity // Changed 'Data' to 'data' for parameter naming consistency
  ): Promise<Either<ErrorClass, ConnectionsEntity>> {
    // Delegate the update of the specific connection to the ConnectionsRepository
    return await this.connectionsRepository.updateRequest(id, loginId, data);
  }
}
