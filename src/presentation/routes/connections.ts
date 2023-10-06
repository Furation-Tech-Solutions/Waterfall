import sequelize from "@main/sequalizeClient";
import { Router } from "express";
import { ConnectionsServices } from "@presentation/services/connections_services"; // Import the ConnectionsServices
import { ConnectionsDataSourceImpl } from "@data/connections/datasource/connections_datasource"; // Import the ConnectionsDataSourceImpl
import { ConnectionsRepositoryImpl } from "@data/connections/repository/connections_repo_impl"; // Import the ConnectionsRepositoryImpl
import { CreateConnections } from "@domain/connections/usecases/create_connections"; // Import Connections-related use cases
import { DeleteConnections } from "@domain/connections/usecases/delete_connections";
import { GetConnectionsById } from "@domain/connections/usecases/get_by_id_connections";
import { GetAllConnections } from "@domain/connections/usecases/get_all_connections";
import { UpdateConnections } from "@domain/connections/usecases/update_connections";
import { GetAllConnectionRequest } from "@domain/connections/usecases/get_all_requests";
import { GetAllConnedctedConnetions } from "@domain/connections/usecases/get_all_connected_Connections";

import { validateConnectionsInputMiddleware } from "@presentation/middlewares/connections/validation-connections";
// Create an instance of the ConnectionsDataSourceImpl and pass the Sequelize connection
const connectionsDataSource = new ConnectionsDataSourceImpl(sequelize);

// Create an instance of the ConnectionsRepositoryImpl and pass the ConnectionsDataSourceImpl
const connectionsRepository = new ConnectionsRepositoryImpl(connectionsDataSource);

// Create instances of the required use cases and pass the connectionsRepositoryImpl
const createConnectionsUsecase = new CreateConnections(connectionsRepository);
const deleteConnectionsUsecase = new DeleteConnections(connectionsRepository);
const getConnectionsByIdUsecase = new GetConnectionsById(connectionsRepository);
const getAllConnectionsUsecase = new GetAllConnections(connectionsRepository);
const updateConnectionsUsecase = new UpdateConnections(connectionsRepository);
const GetAllConnectionRequestUsecase = new GetAllConnectionRequest(connectionsRepository);
const GetAllConnectedConnectionstUsecase = new GetAllConnedctedConnetions(connectionsRepository);

// Initialize connectionsServices and inject required dependencies
const connectionsService = new ConnectionsServices(
    createConnectionsUsecase,
    deleteConnectionsUsecase,
    getConnectionsByIdUsecase,
    getAllConnectionsUsecase,
    updateConnectionsUsecase,
    GetAllConnectionRequestUsecase,
    GetAllConnectedConnectionstUsecase
);

// Create an Express router
export const connectionsRouter = Router();

// Route handling for creating a new connections
connectionsRouter.post(
    "/",
    validateConnectionsInputMiddleware(false),
    connectionsService.createConnections.bind(connectionsService)
);

// Route handling for deleting a connections by ID
connectionsRouter.delete(
    "/:id",
    connectionsService.deleteConnections.bind(connectionsService)
);

// Route handling for getting a connections by ID
connectionsRouter.get(
    "/:id",
    connectionsService.getConnectionsById.bind(connectionsService)
);

// Route handling for getting all connections
connectionsRouter.get("/", connectionsService.getAllConnections.bind(connectionsService));

// Route handling for updating a connections by ID
connectionsRouter.put(
    "/:id",
    validateConnectionsInputMiddleware(true),
    connectionsService.updateConnections.bind(connectionsService)
);


// Route handling for getting all connection requests
connectionsRouter.get("/request", connectionsService.getAllConnectionRequests.bind(connectionsService));

// Route handling for getting all connection requests
connectionsRouter.get("/connected", connectionsService.getAllConnectedConnections.bind(connectionsService));