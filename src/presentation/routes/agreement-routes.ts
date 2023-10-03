// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Correctly import Request and Response
import { AgreementService } from "@presentation/services/agreement-services";
import { AgreementDataSourceImpl } from "@data/agreement/datasources/agreement-data-sources";
import { AgreementRepositoryImpl } from "@data/agreement/repositories/agreement-repository-impl";
import { CreateAgreement } from "@domain/agreement/usecases/create-agreement";
import { GetAgreementById } from "@domain/agreement/usecases/get-agreement-by-id";
import { GetAllAgreements } from "@domain/agreement/usecases/get-all-agreements";
import { UpdateAgreement } from "@domain/agreement/usecases/update-agreement";
import { validateAgreementInputMiddleware } from "@presentation/middlewares/agreement/validation-middleware";

// Create an instance of the AgreementDataSourceImpl and pass the sequalize connection
const agreementDataSource = new AgreementDataSourceImpl(sequelize);

// Create an instance of the AgreementRepositoryImpl and pass the AgreementDataSourceImpl
const agreementRepository = new AgreementRepositoryImpl(agreementDataSource);

// Create instances of the required use cases and pass the AgreementRepositoryImpl
const createAgreementUsecase = new CreateAgreement(agreementRepository);
const getAgreementByIdUsecase = new GetAgreementById(agreementRepository);
const updateAgreementUsecase = new UpdateAgreement(agreementRepository);
const getAllAgreementUsecase = new GetAllAgreements(agreementRepository);

// Initialize AgreementService and inject required dependencies
const agreementService = new AgreementService(
  createAgreementUsecase,
  getAgreementByIdUsecase,
  updateAgreementUsecase,
  getAllAgreementUsecase
);
// Create an Express router
export const agreementRouter = Router();

// Route handling for creating a new Agreement
agreementRouter.post(
  "/",
  validateAgreementInputMiddleware,
  agreementService.createAgreement.bind(agreementService)
);

// Route handling for getting an Agreement by ID
agreementRouter.get(
  "/:id",
  agreementService.getAgreementById.bind(agreementService)
);

// Route handling for updating an Agreement by ID
agreementRouter.put(
  "/:id",
  agreementService.updateAgreement.bind(agreementService)
);


// Route handling for getting all Agreements
agreementRouter.get(
  "/",
  agreementService.getAllAgreements.bind(agreementService)
);
