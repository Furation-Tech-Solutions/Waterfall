
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
import { NotificationDataSourceImpl } from "@data/notification/datasource/notification-datasource";
import { NotificationRepositoryImpl } from "@data/notification/repositories/notification-repositories-impl";
import { CreateNotification } from "@domain/notification/usecases/create-notification";
import { GetByIdNotification } from "@domain/notification/usecases/get-notification-by-id";
import { NotificationServices } from "@presentation/services/notification-service";
import { GetAllNotification } from "@domain/notification/usecases/get-all-notification";
import { verifyUser } from "@presentation/middlewares/authentication/authentication-middleware";

// import { validatemessagesInputMiddleware } from "@presentation/middlewares/messages/validation-messages";

// Create an instance of the messagesDataSourceImpl and pass the Sequelize message
const notificationDataSource = new NotificationDataSourceImpl(sequelize);

// Create an instance of the messagesRepositoryImpl and pass the messagesDataSourceImpl
const notificationRepository = new NotificationRepositoryImpl(notificationDataSource);

// Create instances of the required use cases and pass the messagesRepositoryImpl
const createNotificationUsecase = new CreateNotification(notificationRepository);
// const deleteMessagesUsecase = new DeleteMessage(messagesRepository);
const getNotificationByIdUsecase = new GetByIdNotification(notificationRepository);
const getAllNotificationUsecase = new GetAllNotification(notificationRepository);
// const updateMessagesUsecase = new UpdateMessage(messagesRepository);

// Initialize messagesServices and inject required dependencies
const notificationService = new NotificationServices(
    createNotificationUsecase,
//   deleteMessagesUsecase,
getNotificationByIdUsecase,
//   updateMessagesUsecase,
  getAllNotificationUsecase
);

// Create an Express router
export const notificationRouter = Router();

// Route handling for creating a new messages
notificationRouter.post(
  "/",
  // validateMessageInputMiddleware(false),
  notificationService.createNotification.bind(notificationService)
);

// Route handling for deleting a messages by ID
// messagesRouter.delete(
//   "/:id",
//   notificationService.deleteNotification.bind(notificationService)
// );

// Route handling for getting a Messages by ID
notificationRouter.get(
  "/:id",
  notificationService.getByIdNotification.bind(notificationService)
);

// Route handling for getting all messages
notificationRouter.get("/", 
verifyUser,
notificationService.getAllNotification.bind(notificationService));

// // Route handling for updating a messages by ID
// messagesRouter.put(
//   "/:id",
//   validateMessageInputMiddleware(true),
//   messagesService.updateMessages.bind(messagesService)
// );
