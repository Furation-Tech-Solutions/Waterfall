
import sequelize from "@main/sequalizeClient";
import { Router } from "express";
import { ConnectionsServices } from "@presentation/services/connections_services"; // Import the ConnectionsServices
import { ConnectionsDataSourceImpl } from "@data/connections/datasource/connections_datasource"; // Import the ConnectionsDataSourceImpl
import { ConnectionsRepositoryImpl } from "@data/connections/repository/connections_repo_impl"; // Import the ConnectionsRepositoryImpl
import { CreateRequest } from "@domain/connections/usecases/create_request"; // Import Connections-related use cases
import { DeleteRequest } from "@domain/connections/usecases/delete_Request";
import { GetById } from "@domain/connections/usecases/get_by_id";
// import { getAllConnectionRequests } from "@domain/connections/usecases/get_allConnected_Requests";
import { UpdateRequest } from "@domain/connections/usecases/update_Request";
import { GetAll } from "@domain/connections/usecases/get_all";
// import { GetAllConnedctedConnetions } from "@domain/connections/usecases/get_all_connected_Connections";

import { validateConnectionsInputMiddleware } from "@presentation/middlewares/connections/validation-connections";
// Create an instance of the ConnectionsDataSourceImpl and pass the Sequelize connection
const connectionsDataSource = new ConnectionsDataSourceImpl(sequelize);

// Create an instance of the ConnectionsRepositoryImpl and pass the ConnectionsDataSourceImpl
const connectionsRepository = new ConnectionsRepositoryImpl(connectionsDataSource);

// Create instances of the required use cases and pass the connectionsRepositoryImpl
const createRequestsUsecase = new CreateRequest(connectionsRepository);
const deleteRequestsUsecase = new DeleteRequest(connectionsRepository);
const getRequestsByIdUsecase = new GetById(connectionsRepository);
const getAllRequestsUsecase = new GetAll(connectionsRepository);
const updateRequestsUsecase = new UpdateRequest(connectionsRepository);
// const getAllConnectionRequestUsecase = new getAllConnectionRequests(connectionsRepository);
// const getAllConnectedConnectionstUsecase = new GetAllConnedctedConnetions(connectionsRepository);

// Initialize connectionsServices and inject required dependencies
const connectionsService = new ConnectionsServices(
    createRequestsUsecase,
    deleteRequestsUsecase,
    getRequestsByIdUsecase,
    getAllRequestsUsecase,
    updateRequestsUsecase
    // getAllConnectionRequestUsecase,
    // getAllConnectedConnectionstUsecase
);

// Create an Express router
export const connectionsRouter = Router();

// Route handling for creating a new connections
connectionsRouter.post(
    "/",
    validateConnectionsInputMiddleware(false),
    connectionsService.createRequest.bind(connectionsService)
);

// Route handling for deleting a connections by ID
connectionsRouter.delete(
    "/:id",
    connectionsService.deleteRequest.bind(connectionsService)
);

// Route handling for getting a requests by ID
connectionsRouter.get(
    "/:id",
    connectionsService.getById.bind(connectionsService)
);

// Route handling for getting all connections
connectionsRouter.get("/", connectionsService.getAll.bind(connectionsService));

// Route handling for updating a connections by ID
connectionsRouter.put(
    "/:id",
    validateConnectionsInputMiddleware(true),
    connectionsService.updateRequests.bind(connectionsService)
);


// Route handling for getting all connection requests
// connectionsRouter.get("/requests", connectionsService.getAllConnectionRequests.bind(connectionsService));

// Route handling for getting all connection requests
// connectionsRouter.get("/connected", connectionsService.getAllConnectedConnections.bind(connectionsService));

