import { NextFunction, Request, Response } from "express";
import { ErrorClass } from "@presentation/error-handling/api-error";
import {
  MessageEntity,
  MessageMapper,
  MessageModel,
} from "@domain/messages/entities/msg";
import { CreateMessagesUsecase } from "@domain/messages/usecases/create-msg";
import { DeleteMessagesUsecase } from "@domain/messages/usecases/delete-msg";
import { GetByIdMessageUsecase } from "@domain/messages/usecases/get-msg-by-id";
import { UpdateMessageUsecase } from "@domain/messages/usecases/update-msg";
import { GetAllMessageUsecase } from "@domain/messages/usecases/get-all-msg";
import { Either } from "monet";
import { Query } from "@data/messages/datasources/msg-datasource";
import { CreateNotificationUsecase } from "@domain/notification/usecases/create-notification";
import { NotificationEntity, NotificationMapper, NotificationModel } from "@domain/notification/entities/notification_entity";
import { GetByIdNotificationUsecase } from "@domain/notification/usecases/get-notification-by-id";
import { GetAllNotificationUsecase } from "@domain/notification/usecases/get-all-notification";

export class NotificationServices {
  private readonly createNotificationUsecase: CreateNotificationUsecase;
//   private readonly deleteMessagesUsecase: DeleteNotificationUsecase;
  private readonly getByIdNotificationUsecase: GetByIdNotificationUsecase;
//   private readonly updateMessageUsecase: UpdateMessageUsecase;
  private readonly getAllNotificationUsecase: GetAllNotificationUsecase;

  constructor(
    createNotificationUsecase: CreateNotificationUsecase,
    // deleteMessagesUsecase: DeleteMessagesUsecase,
    getByIdNotificationUsecase: GetByIdNotificationUsecase,
    // updateMessageUsecase: UpdateMessageUsecase,
    getAllNotificationUsecase: GetAllNotificationUsecase
  ) {
    this.createNotificationUsecase = createNotificationUsecase;
    // this.deleteMessagesUsecase = deleteMessagesUsecase;
    this.getByIdNotificationUsecase = getByIdNotificationUsecase;
    // this.updateMessageUsecase = updateMessageUsecase;
    this.getAllNotificationUsecase = getAllNotificationUsecase;
  }

  private sendSuccessResponse(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  private sendErrorResponse(
    res: Response,
    error: ErrorClass,
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  async createNotification(req: Request, res: Response): Promise<void> {
    const Data: NotificationModel = NotificationMapper.toModel(req.body);

    const newNotification: Either<ErrorClass, NotificationEntity> =
      await this.createNotificationUsecase.execute(Data);

      newNotification.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 400),
      (result: NotificationEntity) => {
        const resData = NotificationMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Message created successfully",
          201
        );
      }
    );
  }

//   async deleteNotification(req: Request, res: Response): Promise<void> {
//     let id = req.params.id;

//     const deletedMessages: Either<ErrorClass, void> =
//       await this.deleteMessagesUsecase.execute(id);

//     deletedMessages.cata(
//       (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
//       () => {
//         this.sendSuccessResponse(
//           res,
//           {},
//           "Message deleted successfully",
//           204
//         );
//       }
//     );
//   }

  async getByIdNotification(req: Request, res: Response): Promise<void> {
    let id = req.params.id;

    const NotificationData: Either<ErrorClass, NotificationEntity> =
      await this.getByIdNotificationUsecase.execute(id);

    NotificationData.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      (result: NotificationEntity) => {
        if (!result) {
          return this.sendSuccessResponse(res, {}, "Message not found");
        }
        const resData = NotificationMapper.toEntity(result);
        this.sendSuccessResponse(
          res,
          resData,
          "Notification retrieved successfully"
        );
      }
    );
  }

  async getAllNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    let loginId = req.user;

    const query: Query = {};

    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    // query.toId = parseInt(req.query.toId as string, 10);
    query.searchList = req.query.search as string;
    // query.toId = toId;
    query.toId = req.headers.toid as string;


    const notificationData: Either<ErrorClass, NotificationEntity[]> =
      await this.getAllNotificationUsecase.execute(loginId);

      notificationData.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: NotificationEntity[]) => {
        const responseData = result.map((notification) =>
          NotificationMapper.toEntity(notification)
        );
        this.sendSuccessResponse(res, responseData);
      }
    );
  }

//   async updateMessages(req: Request, res: Response): Promise<void> {
//     const Data: MessageModel = req.body;
//     let id = req.params.id;

//     const existingMessages: Either<ErrorClass, MessageEntity> =
//       await this.getByIdMessageUsecase.execute(id);

//     existingMessages.cata(
//       (error: ErrorClass) => {
//         this.sendErrorResponse(res, error, 404);
//       },
//       async (existingData: MessageEntity) => {
//         const updatedMessageEntity: MessageEntity =
//           MessageMapper.toEntity(Data, true, existingData);

//         const updatedMessages: Either<ErrorClass, MessageEntity> =
//           await this.updateMessageUsecase.execute(
//             id,
//             updatedMessageEntity
//           );

//         updatedMessages.cata(
//           (error: ErrorClass) => {
//             this.sendErrorResponse(res, error, 500);
//           },
//           (result: MessageEntity) => {
//             const resData = MessageMapper.toEntity(result, true);
//             this.sendSuccessResponse(
//               res,
//               resData,
//               "Message updated successfully"
//             );
//           }
//         );
//       }
//     );
//   }
}
