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
import { NotificationSender } from "./push-notification-services";

export class MessagesServices {
  private readonly createMessagesUsecase: CreateMessagesUsecase;
  private readonly deleteMessagesUsecase: DeleteMessagesUsecase;
  private readonly getByIdMessageUsecase: GetByIdMessageUsecase;
  private readonly updateMessageUsecase: UpdateMessageUsecase;
  private readonly getAllMessageUsecase: GetAllMessageUsecase;

  constructor(
    createMessagesUsecase: CreateMessagesUsecase,
    deleteMessagesUsecase: DeleteMessagesUsecase,
    getByIdMessageUsecase: GetByIdMessageUsecase,
    updateMessageUsecase: UpdateMessageUsecase,
    getAllMessageUsecase: GetAllMessageUsecase
  ) {
    this.createMessagesUsecase = createMessagesUsecase;
    this.deleteMessagesUsecase = deleteMessagesUsecase;
    this.getByIdMessageUsecase = getByIdMessageUsecase;
    this.updateMessageUsecase = updateMessageUsecase;
    this.getAllMessageUsecase = getAllMessageUsecase;
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

  async createMessage(req: Request, res: Response): Promise<void> {
    const Data: MessageModel = MessageMapper.toModel(req.body);

    const newMessages: Either<ErrorClass, MessageEntity> =
      await this.createMessagesUsecase.execute(Data);

    newMessages.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 400),
      (result: MessageEntity) => {
        const resData = MessageMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Message created successfully",
          201
        );
        console.log(result)
        const pushNotification=new NotificationSender()
        pushNotification.customNotification(result.senderId,result.receiverId,"sendMessage")
      }
    );
// 
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    let id = req.params.id;

    const deletedMessages: Either<ErrorClass, void> =
      await this.deleteMessagesUsecase.execute(id);

    deletedMessages.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Message deleted successfully",
          204
        );
      }
    );
  }

  async getByIdMessages(req: Request, res: Response): Promise<void> {
    let id = req.params.id;

    const Messages: Either<ErrorClass, MessageEntity> =
      await this.getByIdMessageUsecase.execute(id);

    Messages.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      (result: MessageEntity) => {
        if (!result) {
          return this.sendSuccessResponse(res, {}, "Message not found");
        }
        const resData = MessageMapper.toEntity(result);
        this.sendSuccessResponse(
          res,
          resData,
          "Message retrieved successfully"
        );
      }
    );
  }

  async getAllMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    let loginId = req.headers.fromid as string;
    // let Id = req.user;


    const query: Query = {};

    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10);
    query.limit = parseInt(req.query.limit as string, 10);
    // query.toId = parseInt(req.query.toId as string, 10);
    query.searchList = req.query.search as string;
    // query.toId = toId;
    query.toId = req.headers.toid as string;


    const clientMessages: Either<ErrorClass, MessageEntity[]> =
      await this.getAllMessageUsecase.execute(loginId, query);

    clientMessages.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status),
      (result: MessageEntity[]) => {
        const responseData = result.map((message) =>
          MessageMapper.toEntity(message)
        );
        this.sendSuccessResponse(res, responseData);
      }
    );
  }

  async updateMessages(req: Request, res: Response): Promise<void> {
    const Data: MessageModel = req.body;
    let id = req.params.id;

    const existingMessages: Either<ErrorClass, MessageEntity> =
      await this.getByIdMessageUsecase.execute(id);

    existingMessages.cata(
      (error: ErrorClass) => {
        this.sendErrorResponse(res, error, 404);
      },
      async (existingData: MessageEntity) => {
        const updatedMessageEntity: MessageEntity =
          MessageMapper.toEntity(Data, true, existingData);

        const updatedMessages: Either<ErrorClass, MessageEntity> =
          await this.updateMessageUsecase.execute(
            id,
            updatedMessageEntity
          );

        updatedMessages.cata(
          (error: ErrorClass) => {
            this.sendErrorResponse(res, error, 500);
          },
          (result: MessageEntity) => {
            const resData = MessageMapper.toEntity(result, true);
            this.sendSuccessResponse(
              res,
              resData,
              "Message updated successfully"
            );
          }
        );
      }
    );
  }
}
