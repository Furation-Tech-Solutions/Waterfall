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
    getAllRequests(): Promise<Either<ErrorClass, ConnectionsEntity[]>>;

    // for connected realtors
    // getAllConnectionRequests(): Promise<Either<ErrorClass, ConnectionsEntity[]>>;
    // getAllConnectedConnections(): Promise<Either<ErrorClass, ConnectionsEntity[]>>;

}
