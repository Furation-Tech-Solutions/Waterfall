// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either, Right, Left } from "monet";
import { NotificationEntity, NotificationModel } from "../entities/notification_entity";
import { NotificationRepository } from "../repositories/notification-repository";

// Define the interface for the CreateMessages use case
export interface CreateNotificationUsecase {
  execute: (messagesData: NotificationModel) => Promise<Either<ErrorClass, NotificationEntity>>;
}

// Implement the CreateMessages use case
export class CreateNotification implements CreateNotificationUsecase {
  private readonly notificationRepository: NotificationRepository;

  // Constructor to initialize the NotificationRepository
  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  // Implementation of the execute method
  // This method takes messageModel data and returns a Promise with an Either result
  async execute(notificationData: NotificationModel): Promise<Either<ErrorClass, NotificationEntity>> {
    // Delegate the creation of messages to the messagesRepository
    return await this.notificationRepository.createNotification(notificationData);
  }
}
