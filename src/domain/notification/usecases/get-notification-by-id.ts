import { ErrorClass } from "@presentation/error-handling/api-error";// Import the MessagesRepository
import { Either, Right, Left } from "monet";
import { NotificationRepository } from "../repositories/notification-repository";
import { NotificationEntity } from "../entities/notification_entity";

export interface GetByIdNotificationUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, NotificationEntity>>;
}

export class GetByIdNotification implements GetByIdNotificationUsecase {
  private readonly notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, NotificationEntity>> {
    return await this.notificationRepository.getNotificationById(id);
  }
}

