import {
  NotificationModel,
  NotificationEntity,
} from "../entities/notification_entity"; // Import theConnectionsEntity and ConnectionsModel classes
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Query } from "@data/messages/datasources/msg-datasource";

export interface NotificationRepository {
  // Method to create a message entity
  createNotification(
    message: NotificationModel
  ): Promise<Either<ErrorClass, NotificationEntity>>;
  // Method to delete a message entity by its ID
  deleteNotification(id: string): Promise<Either<ErrorClass, void>>;
  getNotificationById(
    id: string
  ): Promise<Either<ErrorClass, NotificationEntity>>;
  getAllNotification(
    loginId: string
  ): Promise<Either<ErrorClass, NotificationEntity[]>>;
}
