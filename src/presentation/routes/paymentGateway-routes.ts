// Import necessary classes, interfaces, and dependencies
import sequelize from "@main/sequelizeClient";
import { Router } from "express"; // Import the Router class from Express
import { PaymentGatewayService } from "@presentation/services/paymentGateway-services";
import { PaymentGatewayDataSourceImpl } from "@data/paymentGateway/datasources/paymentGateway-data-sources";
import { PaymentGatewayRepositoryImpl } from "@data/paymentGateway/repositories/paymentGateway-repository-impl";
import { CreatePaymentGateway } from "@domain/paymentGateway/usecases/create-paymentGateway";
import { DeletePaymentGateway } from "@domain/paymentGateway/usecases/delete-paymentGateway";
import { GetPaymentGatewayById } from "@domain/paymentGateway/usecases/get-paymentGateway-by-id";
import { GetAllPaymentGateways } from "@domain/paymentGateway/usecases/get-all-paymentGateway";
import { UpdatePaymentGateway } from "@domain/paymentGateway/usecases/update-paymentGateway";
import { validatePaymentGatewayInputMiddleware } from "@presentation/middlewares/paymentGateway/validation-middleware";

// Create an instance of the PaymentGatewayDataSourceImpl and pass the sequelize connection
const paymentGatewayDataSource = new PaymentGatewayDataSourceImpl(sequelize);

// Create an instance of the PaymentGatewayRepositoryImpl and pass the PaymentGatewayDataSourceImpl
const paymentGatewayRepository = new PaymentGatewayRepositoryImpl(paymentGatewayDataSource);

// Create instances of the required use cases and pass the PaymentGatewayRepositoryImpl
const createPaymentGatewayUsecase = new CreatePaymentGateway(paymentGatewayRepository);
const deletePaymentGatewayUsecase = new DeletePaymentGateway(paymentGatewayRepository);
const getPaymentGatewayByIdUsecase = new GetPaymentGatewayById(paymentGatewayRepository);
const updatePaymentGatewayUsecase = new UpdatePaymentGateway(paymentGatewayRepository);
const getAllPaymentGatewayUsecase = new GetAllPaymentGateways(paymentGatewayRepository);

// Initialize PaymentGatewayService and inject required dependencies
const paymentGatewayService = new PaymentGatewayService(
  createPaymentGatewayUsecase,
  deletePaymentGatewayUsecase,
  getPaymentGatewayByIdUsecase,
  updatePaymentGatewayUsecase,
  getAllPaymentGatewayUsecase
);

// Create an Express router
export const paymentGatewayRouter = Router();

// Route handling for creating a new PaymentGateway
paymentGatewayRouter.post(
  "/", // Endpoint for creating a new PaymentGateway
  validatePaymentGatewayInputMiddleware, // Apply input validation middleware
  paymentGatewayService.createPaymentGateway.bind(paymentGatewayService) // Bind the createPaymentGateway method to handle the route
);

// Route handling for getting a PaymentGateway by ID
paymentGatewayRouter.get("/:id", paymentGatewayService.getPaymentGatewayById.bind(paymentGatewayService));

// Route handling for updating a PaymentGateway by ID
paymentGatewayRouter.put("/:id", paymentGatewayService.updatePaymentGateway.bind(paymentGatewayService));

// Route handling for deleting a PaymentGateway by ID
paymentGatewayRouter.delete("/:id", paymentGatewayService.deletePaymentGateway.bind(paymentGatewayService));

// Route handling for getting all PaymentGateways
paymentGatewayRouter.get("/", paymentGatewayService.getAllPaymentGateways.bind(paymentGatewayService));
