// Import necessary classes, interfaces, and dependencies
import mongoose from "mongoose";
import { Router } from "express"; // Correctly import Request and Response
import { RealtorService } from "@presentation/services/realtor-services";
import { RealtorDataSourceImpl } from "@data/realtors/datasources/realtor-data-source";
import { RealtorRepositoryImpl } from "@data/realtors/repositories/realtor-repositories-impl";
import { CreateRealtor } from "@domain/realtors/usecases/create-realtor";
import { validateRealtorInputMiddleware } from "@presentation/middlewares/realtors/validation-middleware";
import { GetAllRealtors } from "@domain/realtors/usecases/get-all-realtors";
import { GetRealtorById } from "@domain/realtors/usecases/get-realtor-by-id";
import { UpdateRealtor } from "@domain/realtors/usecases/update-realtor";
import { DeleteRealtor } from "@domain/realtors/usecases/delete-realtor";
import { sequelize } from "@main/sequelizeClient";
import { LoginRealtor } from "@domain/realtors/usecases/login-realtor";
import { CheckRealtorByRecoId } from "@domain/realtors/usecases/Check-realtor-by-Reco-id";
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";
import { GetAllReportedRealtors } from "@domain/realtors/usecases/reported-realtors";


// Create an instance of the RealtorDataSourceImpl and pass the mongoose connection
const realtorDataSource = new RealtorDataSourceImpl(sequelize);

// Create an instance of the OutletRepositoryImpl and pass the OutletDataSourceImpl
const realtorRepository = new RealtorRepositoryImpl(realtorDataSource);

// Create instances of the required use cases and pass the RealtorRepositoryImpl
const createRealtorUsecase = new CreateRealtor(realtorRepository);
const getAllRealtorsUsecase = new GetAllRealtors(realtorRepository);
const getRealtorByIdUsecase = new GetRealtorById(realtorRepository);
const updateRealtorUsecase = new UpdateRealtor(realtorRepository);
const deleteRealtorUsecase = new DeleteRealtor(realtorRepository);
const loginRealtorUsecase = new LoginRealtor(realtorRepository);
const CheckRealtorByRecoIdUsecase = new CheckRealtorByRecoId(realtorRepository);
const getAllReportedRealtorsUsecase = new GetAllReportedRealtors(realtorRepository);

// Initialize RealtorService and inject required dependencies
const realtorService = new RealtorService(
  createRealtorUsecase,
  getAllRealtorsUsecase,
  getRealtorByIdUsecase,
  updateRealtorUsecase,
  deleteRealtorUsecase,
  loginRealtorUsecase,
  CheckRealtorByRecoIdUsecase,
  getAllReportedRealtorsUsecase,
);

// Create an Express router
export const realtorRouter = Router();

// Route handling for creating a new realtor
realtorRouter.post("/",
  validateRealtorInputMiddleware(false),
  realtorService.createRealtor.bind(realtorService));

// Route handling for getting all realtorsx`
realtorRouter.get("/", realtorService.getAllRealtors.bind(realtorService));

// Route handling for getting an Realtor by ID
realtorRouter.get("/:id",verifyUser, realtorService.getRealtorById.bind(realtorService));

// Route handling for updating an realtor by ID
realtorRouter.put("/:id",verifyUser, validateRealtorInputMiddleware(true), realtorService.updateRealtor.bind(realtorService));

// Route handling for deleting an realtor by ID
realtorRouter.delete("/:id",verifyUser, realtorService.deleteRealtor.bind(realtorService));

// Route handling for login realtor by email for deviceToken
realtorRouter.post(
  "/login",
  realtorService.loginRealtor.bind(realtorService)
)

// Route handling for getting an Realtor by ID
realtorRouter.get("/checkRecoId/:id", realtorService.CheckRecoId.bind(realtorService));

realtorRouter.get("/get/reported", realtorService.reportedUsers.bind(realtorService));

realtorRouter.patch("/banunban/realtor/:id",  validateRealtorInputMiddleware(true), realtorService.disableFirebaseAuthForBannedUser.bind(realtorService));