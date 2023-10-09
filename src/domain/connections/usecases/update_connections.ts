import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

export interface UpdateConnectionsUsecase {
  execute: (
    id: string,
    Data: ConnectionsEntity
  ) => Promise<Either<ErrorClass, ConnectionsEntity>>;
}

export class UpdateConnections implements UpdateConnectionsUsecase {
  private readonly connectionsRepository: ConnectionsRepository;

  constructor(connectionsRepository: ConnectionsRepository) {
    this.connectionsRepository = connectionsRepository;
  }

  async execute(
    id: string,
    Data: ConnectionsEntity
  ): Promise<Either<ErrorClass, ConnectionsEntity>> {
    return await this.connectionsRepository.updateConnections(id, Data);
  }
}
