// Import necessary modules and dependencies
import {
  MessageEntity,
  MessageModel,
} from "@domain/messages/entities/msg"; // Import the MessageModel
import { MessagesRepository } from "@domain/messages/repositories/msg-repository"; // Import the MessagesRepository
import { Either, Right, Left } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { string } from "joi";
import { NotificationRepository } from "@domain/notification/repositories/notification-repository";
import { NotificationDataSource } from "../datasource/notification-datasource";
import { NotificationEntity } from "@domain/notification/entities/notification_entity";

// Implementation of the MessagesRepository interface
export class NotificationRepositoryImpl implements NotificationRepository {
  private readonly notificationDataSource: NotificationDataSource;

  constructor(notificationDataSource: NotificationDataSource) {
    this.notificationDataSource = notificationDataSource;
  }

  // Create a new message entry
  async createNotification(
    data: MessageModel
  ): Promise<Either<ErrorClass, NotificationEntity>> {
    try {
      const createdNotification = await this.notificationDataSource.createNotification(
        data
      ); // Use the createdMessage data source

      return Right<ErrorClass, NotificationEntity>(createdNotification);
    } catch (error: any) {
      return Left<ErrorClass, NotificationEntity>(
        ApiError.customError(400, error.message)
      );
    }
  }

  // Delete a message entry by ID
  async deleteNotification(
    id: string
  ): Promise<Either<ErrorClass, void>> {
    try {
      const result = await this.notificationDataSource.deleteNotification(
        id
      ); // Use the messages data source

      return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, void>(ApiError.notFound());
      }
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }

  async getAllNotification(
    loginId: string
  ): Promise<Either<ErrorClass, NotificationEntity[]>> {
    try {
      const notificationData = await this.notificationDataSource.getAll(loginId); // Use the messages data source
      // Check if the data length is zero
      if (notificationData.length === 0) {
        // If data length is zero, throw a "404 Not Found" error
        return Left<ErrorClass, NotificationEntity[]>(ApiError.dataNotFound());
      }
      return Right<ErrorClass, NotificationEntity[]>(notificationData);
    } catch (e: any) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, NotificationEntity[]>(ApiError.notFound());
      } else {
        return Left<ErrorClass, []>(ApiError.customError(400, e.message));
      }
    }
  }

 
  // Retrieve a message entry by its ID
  async getNotificationById(
    id: string
  ): Promise<Either<ErrorClass, NotificationEntity>> {
    try {
      const notificationData = await this.notificationDataSource.read(
        id
      ); // Use the messages data source
      return Right<ErrorClass, NotificationEntity>(notificationData);
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, NotificationEntity>(ApiError.notFound());
      }
      return Left<ErrorClass, NotificationEntity>(ApiError.badRequest());
    }
  }
}
