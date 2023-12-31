// Import necessary classes, interfaces, and dependencies
import { sequelize } from "@main/sequelizeClient";
import { Router } from "express"; // Import the Router class from Express
import { PaymentGatewayService } from "@presentation/services/paymentGateway-services";
import { PaymentGatewayDataSourceImpl } from "@data/paymentGateway/datasources/paymentGateway-data-sources";
import { PaymentGatewayRepositoryImpl } from "@data/paymentGateway/repositories/paymentGateway-repository-impl";
import { CreatePaymentGateway } from "@domain/paymentGateway/usecases/create-paymentGateway";
import { DeletePaymentGateway } from "@domain/paymentGateway/usecases/delete-paymentGateway";
import { GetPaymentGatewayById } from "@domain/paymentGateway/usecases/get-paymentGateway-by-id";
import { GetAllPaymentGateways } from "@domain/paymentGateway/usecases/get-all-paymentGateway";
import { UpdatePaymentGateway } from "@domain/paymentGateway/usecases/update-paymentGateway";
import { CheckBalance } from "@domain/paymentGateway/usecases/checkBalance";
import { CreateConnectAccount } from "@domain/paymentGateway/usecases/createConnectAccount";
import { Dashboard } from "@domain/paymentGateway/usecases/dashboard";
import { DeleteAccount } from "@domain/paymentGateway/usecases/deleteAccount";
import { GenerateAccountLink } from "@domain/paymentGateway/usecases/generateAccountLink";
import { ProcessPayment } from "@domain/paymentGateway/usecases/processPayment";
import { RetrieveAccount } from "@domain/paymentGateway/usecases/retrieveAccount";
import { Transactions } from "@domain/paymentGateway/usecases/transactions";
import { UpdateAccount } from "@domain/paymentGateway/usecases/updateAccount";
import { validatePaymentGatewayInputMiddleware } from "@presentation/middlewares/paymentGateway/validation-middleware";
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";

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
const checkBalanceUsecase = new CheckBalance(paymentGatewayRepository);
const createConnectAccountUsecase = new CreateConnectAccount(paymentGatewayRepository);
const dashboardUsecase = new Dashboard(paymentGatewayRepository);
const deleteAccountUsecase = new DeleteAccount(paymentGatewayRepository);
const generateAccountLinkUsecase = new GenerateAccountLink(paymentGatewayRepository);
const processPaymentUsecase = new ProcessPayment(paymentGatewayRepository);
const retrieveAccountUsecase = new RetrieveAccount(paymentGatewayRepository);
const transactionsUsecase = new Transactions(paymentGatewayRepository);
const updateAccountUsecase = new UpdateAccount(paymentGatewayRepository);


// Initialize PaymentGatewayService and inject required dependencies
const paymentGatewayService = new PaymentGatewayService(
  createPaymentGatewayUsecase,
  deletePaymentGatewayUsecase,
  getPaymentGatewayByIdUsecase,
  updatePaymentGatewayUsecase,
  getAllPaymentGatewayUsecase,
  checkBalanceUsecase,
  createConnectAccountUsecase,
  dashboardUsecase,
  deleteAccountUsecase,
  generateAccountLinkUsecase,
  processPaymentUsecase,
  retrieveAccountUsecase,
  transactionsUsecase,
  updateAccountUsecase
);

// Create an Express router
export const paymentGatewayRouter = Router();

// Route handling for creating a new PaymentGateway
paymentGatewayRouter.post(
  "/", // Endpoint for creating a new PaymentGateway
  verifyUser,
  validatePaymentGatewayInputMiddleware(false), // Apply input validation middleware
  paymentGatewayService.createPaymentGateway.bind(paymentGatewayService) // Bind the createPaymentGateway method to handle the route
);

// Route handling for getting a PaymentGateway by ID
paymentGatewayRouter.get("/:id", verifyUser, paymentGatewayService.getPaymentGatewayById.bind(paymentGatewayService));

// Route handling for updating a PaymentGateway by ID
paymentGatewayRouter.put("/:id", verifyUser, validatePaymentGatewayInputMiddleware(true), paymentGatewayService.updatePaymentGateway.bind(paymentGatewayService));

// Route handling for deleting a PaymentGateway by ID
paymentGatewayRouter.delete("/:id", verifyUser, paymentGatewayService.deletePaymentGateway.bind(paymentGatewayService));

// Route handling for getting all PaymentGateways
paymentGatewayRouter.get("/", verifyUser, paymentGatewayService.getAllPaymentGateways.bind(paymentGatewayService));

// Route handling for checking balance
paymentGatewayRouter.get("/CheckBalance/", verifyUser, paymentGatewayService.checkBalance.bind(paymentGatewayService));

// Route handling for creating connect account
paymentGatewayRouter.post("/account/", verifyUser, paymentGatewayService.createConnectAccount.bind(paymentGatewayService));

// Route handling for dashboard
paymentGatewayRouter.get("/account/Dashboard/", verifyUser, paymentGatewayService.dashboard.bind(paymentGatewayService));

// Route handling for deleting account
paymentGatewayRouter.delete("/account/:id", verifyUser, paymentGatewayService.deleteAccount.bind(paymentGatewayService));

// Route handling for generating account link
paymentGatewayRouter.get("/account/GenerateAccountLink/", verifyUser, paymentGatewayService.generateAccountLink.bind(paymentGatewayService));

// Route handling for processing payment
paymentGatewayRouter.get("/account/ProcessPayment/", verifyUser, paymentGatewayService.processPayment.bind(paymentGatewayService));

// Route handling for retrieving account
paymentGatewayRouter.get("/account/RetrieveAccount/", verifyUser, paymentGatewayService.retrieveAccount.bind(paymentGatewayService));

// Route handling for transactions
paymentGatewayRouter.get("/account/Transactions/", verifyUser, paymentGatewayService.transactions.bind(paymentGatewayService));

// Route handling for updating account
paymentGatewayRouter.put("/account/:id", verifyUser, paymentGatewayService.updateAccount.bind(paymentGatewayService));







