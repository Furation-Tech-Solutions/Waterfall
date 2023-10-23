import { ConnectionsEntity, ConnectionsModel } from "../entities/connections_entities"; // Import theConnectionsEntity and ConnectionsModel classes
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

export interface ConnectionsRepository {
    createRequest(
        connections: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    deleteRequest(id: string): Promise<Either<ErrorClass, void>>;
    getById(id: string): Promise<Either<ErrorClass, ConnectionsEntity>>;
    updateRequest(
        id: string,
        data: ConnectionsModel
    ): Promise<Either<ErrorClass, ConnectionsEntity>>;
    getAll(): Promise<Either<ErrorClass, ConnectionsEntity[]>>;
    // Allrequests(): Promise<Either<ErrorClass, ConnectionsEntity[]>>;
    // AllConnections(): Promise<Either<ErrorClass, ConnectionsEntity[]>>;

}


