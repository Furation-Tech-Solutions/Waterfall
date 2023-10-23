import { ErrorClass } from "@presentation/error-handling/api-error";
import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import the ConnectionsModel and ConnectionsEntity
import { ConnectionsRepository } from "../repositories/connections_repo"; // Import the ConnectionsRepository
import { Either, Right, Left } from "monet";

export interface UpdateRequestUsecase {
  execute: (
    fromId: string,
    toId: string,
    Data: ConnectionsEntity
  ) => Promise<Either<ErrorClass, ConnectionsEntity>>;
}

export class UpdateRequest implements UpdateRequestUsecase {
  private readonly connectionsRepository: ConnectionsRepository;

  constructor(connectionsRepository: ConnectionsRepository) {
    this.connectionsRepository = connectionsRepository;
  }

  async execute(
    fromId: string,
    toId: string,
    Data: ConnectionsEntity
  ): Promise<Either<ErrorClass, ConnectionsEntity>> {
    return await this.connectionsRepository.updateRequest(fromId, toId, Data);
  }
}
