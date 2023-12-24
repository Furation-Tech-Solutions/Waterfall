
import { sequelize } from "@main/sequelizeClient";
import { Router } from "express";
import { MessagesServices } from "@presentation/services/messages-services"; // Import the messagesServices
import { MessagesDataSourceImpl } from "@data/messages/datasources/msg-datasource"; // Import the messagesDataSourceImpl
import { MessagesRepositoryImpl } from "@data/messages/repositories/msg-repositories-impl"; // Import the messagesRepositoryImpl
import { CreateMessages } from "@domain/messages/usecases/create-msg"; // Import messages-related use cases
import { DeleteMessage } from "@domain/messages/usecases/delete-msg";
import { GetAllMessage } from "@domain/messages/usecases/get-all-msg";
import { GetByIdMessage } from "@domain/messages/usecases/get-msg-by-id";
import { UpdateMessage } from "@domain/messages/usecases/update-msg";
import { validateMessageInputMiddleware } from "@presentation/middlewares/message/validation-middleware";
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";

// import { validatemessagesInputMiddleware } from "@presentation/middlewares/messages/validation-messages";

// Create an instance of the messagesDataSourceImpl and pass the Sequelize message
const messagesDataSource = new MessagesDataSourceImpl(sequelize);

// Create an instance of the messagesRepositoryImpl and pass the messagesDataSourceImpl
const messagesRepository = new MessagesRepositoryImpl(messagesDataSource);

// Create instances of the required use cases and pass the messagesRepositoryImpl
const createMessagesUsecase = new CreateMessages(messagesRepository);
const deleteMessagesUsecase = new DeleteMessage(messagesRepository);
const getMessagesByIdUsecase = new GetByIdMessage(messagesRepository);
const getAllMessagesUsecase = new GetAllMessage(messagesRepository);
const updateMessagesUsecase = new UpdateMessage(messagesRepository);

// Initialize messagesServices and inject required dependencies
const messagesService = new MessagesServices(
  createMessagesUsecase,
  deleteMessagesUsecase,
  getMessagesByIdUsecase,
  updateMessagesUsecase,
  getAllMessagesUsecase
);

// Create an Express router
export const messagesRouter = Router();

// Route handling for creating a new messages
messagesRouter.post(
  "/",
  verifyUser,
  validateMessageInputMiddleware(false),
  messagesService.createMessage.bind(messagesService)
);

// Route handling for deleting a messages by ID
messagesRouter.delete(
  "/:id",
  verifyUser,
  messagesService.deleteMessage.bind(messagesService)
);

// Route handling for getting a Messages by ID
messagesRouter.get(
  "/:id",
  verifyUser,
  messagesService.getByIdMessages.bind(messagesService)
);

// Route handling for getting all messages
messagesRouter.get("/",verifyUser, messagesService.getAllMessages.bind(messagesService));

// Route handling for updating a messages by ID
messagesRouter.put(
  "/:id",
  verifyUser,
  validateMessageInputMiddleware(true),
  messagesService.updateMessages.bind(messagesService)
);
