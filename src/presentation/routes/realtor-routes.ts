// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { RealtorService } from "@presentation/services/realtor-services";
import { RealtorDataSourceImpl } from "@data/realtors/datasources/realtor-data-source";
import { RealtorRepositoryImpl } from "@data/realtors/repositories/realtor-repositories-impl";
import { CreateRealtor } from "@domain/realtors/usecases/create-realtor";
import validateRealtorMiddleware from "@presentation/middlewares/realtors/validation-middleware";


// Create an instance of the RealtorDataSourceImpl and pass the mongoose connection
const realtorDataSource = new RealtorDataSourceImpl(mongoose.connection);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const realtorRepository = new RealtorRepositoryImpl(realtorDataSource);

// Create instances of the required use cases and pass the RealtorRepositoryImpl
const createRealtorUsecase = new CreateRealtor(realtorRepository);

// Initialize RealtorService and inject required dependencies
const realtorService = new RealtorService(
  createRealtorUsecase,
);

// Create an Express router
export const realtorRouter = Router();

// Route handling for creating a new realtor
realtorRouter.post("/add", validateRealtorMiddleware, realtorService.createRealtor.bind(realtorService));
