// Import necessary classes, interfaces, and dependencies
import {sequelize} from "@main/sequelizeClient";
import { Router } from "express"; // Import the Router class from Express
import { NotInterestedService } from "@presentation/services/notInterested-services";
import { NotInterestedDataSourceImpl } from "@data/notInterested/datasources/notInterested-datasource";
import { NotInterestedRepositoryImpl } from "@data/notInterested/repositories/notInterested-repository-impl"
import { CreateNotInterested } from "@domain/notInterested/usecases/create-notInterested";
import { DeleteNotInterested } from "@domain/notInterested/usecases/delete-notInterested";
import { GetNotInterestedById } from "@domain/notInterested/usecases/get-notInterested-by-id";
import { GetAllNotInteresteds } from "@domain/notInterested/usecases/get-all-notInterested";
import { UpdateNotInterested } from "@domain/notInterested/usecases/update-notInterested";
import { validateNotInterestedInputMiddleware } from "@presentation/middlewares/notInterested/validation-middleware";
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";

// Create an instance of the NotInterestedDataSourceImpl and pass the sequelize connection
const notInterestedDataSource = new NotInterestedDataSourceImpl(sequelize);

// Create an instance of the NotInterestedRepositoryImpl and pass the NotInterestedDataSourceImpl
const notInterestedRepository = new NotInterestedRepositoryImpl(notInterestedDataSource);

// Create instances of the required use cases and pass the NotInterestedRepositoryImpl
const createNotInterestedUsecase = new CreateNotInterested(notInterestedRepository);
const deleteNotInterestedUsecase = new DeleteNotInterested(notInterestedRepository);
const getNotInterestedByIdUsecase = new GetNotInterestedById(notInterestedRepository);
const updateNotInterestedUsecase = new UpdateNotInterested(notInterestedRepository);
const getAllNotInterestedUsecase = new GetAllNotInteresteds(notInterestedRepository);

// Initialize NotInterestedService and inject required dependencies
const notInterestedService = new NotInterestedService(
    createNotInterestedUsecase,
    deleteNotInterestedUsecase,
    getNotInterestedByIdUsecase,
    updateNotInterestedUsecase,
    getAllNotInterestedUsecase
);

// Create an Express router
export const notInterestedRouter = Router();

// Route handling for creating a new Job
notInterestedRouter.post(
    "/", // Define the route URL
    verifyUser,
    validateNotInterestedInputMiddleware(false), // Apply input validation middleware
    notInterestedService.createNotInterested.bind(notInterestedService) // Bind the createNotInterested method to handle the route
);

// Route handling for getting a NotInterested by ID
notInterestedRouter.get(
    "/:id",
    verifyUser,
    notInterestedService.getNotInterestedById.bind(notInterestedService)
);

// Route handling for updating a NotInterested by ID
notInterestedRouter.put(
    "/:id",
    verifyUser,
     validateNotInterestedInputMiddleware(true),
    notInterestedService.updateNotInterested.bind(notInterestedService)
);

// Route handling for deleting a NotInterested by ID
notInterestedRouter.delete(
    "/:id",
    verifyUser,
    notInterestedService.deleteNotInterested.bind(notInterestedService)
);

// Route handling for getting all NotInteresteds
notInterestedRouter.get("/", verifyUser,notInterestedService.getAllNotInteresteds.bind(notInterestedService));
