// Import necessary dependencies and types
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either, Right, Left } from "monet";
import { Query } from "@data/messages/datasources/msg-datasource";
import { NotificationEntity } from "../entities/notification_entity";
import { NotificationRepository } from "../repositories/notification-repository";

// Define the interface for the GetAllmessages use case
export interface GetAllNotificationUsecase {
  // Method to fetch all messages
  execute: (
    loginId: string,
  ) => Promise<Either<ErrorClass, NotificationEntity[]>>;
}

// Implement the GetAllmessages use case
export class GetAllNotification implements GetAllNotificationUsecase {
  private readonly notificationRepository: NotificationRepository;

  // Constructor to initialize the MessagesRepository
  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  // Implementation of the execute method
  // This method retrieves all messages and returns a Promise with an Either result
  async execute(
    loginId: string
  ): Promise<Either<ErrorClass, NotificationEntity[]>> {
    // Delegate the retrieval of all messages to the messagesRepository
    return await this.notificationRepository.getAllNotification(loginId);
  }
}
