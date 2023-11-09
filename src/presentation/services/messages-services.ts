// Import necessary dependencies and types
import { NextFunction, Request, Response, query } from "express";
import { ErrorClass } from "@presentation/error-handling/api-error";
import {
  MessageEntity,
  MessageMapper,
  MessageModel,
} from "@domain/messages/entities/msg"; // Import Messages-related entities and mapper

import { CreateMessagesUsecase } from "@domain/messages/usecases/create-msg"; // Import Messages-related use cases
import { DeleteMessagesUsecase } from "@domain/messages/usecases/delete-msg";
import { GetByIdMessageUsecase } from "@domain/messages/usecases/get-msg-by-id";
import { UpdateMessageUsecase } from "@domain/messages/usecases/update-msg";
import { GetAllMessageUsecase } from "@domain/messages/usecases/get-all-msg";
import { Either } from "monet";
import { Query } from "@data/messages/datasources/msg-datasource";

// Define a class for handling Messages-related services
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

  // Handler for creating new messages
  async createMessage(req: Request, res: Response): Promise<void> {
    //----------------------------------------------------------------------------
    // Extract data from the request body and map it to the MessagesModel
    // const id: string = req.params.id;
    // let loginId: number = req.body.loginId;
    // loginId = 1;
    // req.body.fromId = loginId;
    // req.body.toId = id;
    //-----------------------------------------------------------------------------
    const Data: MessageModel = MessageMapper.toModel(req.body);
    // console.log(req.body, 'serviec');

    // Execute the createMessages use case to create a new message
    const newMessages: Either<ErrorClass, MessageEntity> =
      await this.createMessagesUsecase.execute(Data);

    // Handle the result of the use case execution
    newMessages.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }), // Handle error case
      (result: MessageEntity) => {
        // Handle success case
        const resData = MessageMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Handler for deleting Messages by ID
  async deleteMessage(req: Request, res: Response): Promise<void> {
    //-----------------------------------------------------------------------------
    // const toId: string = req.params.id;
    // let loginId: string = req.body.loginId;
    // loginId = "1";
    // const fromId: string = loginId;
    //-----------------------------------------------------------------------------
    let loginId = req.body.fromId;
    let id = req.params.id;
    // Execute the deleteMessages use case to delete a message by ID
    const deletedMessages: Either<ErrorClass, void> =
      await this.deleteMessagesUsecase.execute(loginId, id);

    // Handle the result of the use case execution
    deletedMessages.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }), // Handle error case
      (result: void) => {
        // Handle success case
        return res.json({ message: "message deleted successfully." });
      }
    );
  }

  // Handler for getting Messages by ID
  async getByIdMessages(req: Request, res: Response): Promise<void> {
    //-----------------------------------------------------------------------------
    // let fromId: string = req.body.loginId;
    // fromId = "6";
    // const toId: string = req.params.id;
    //-----------------------------------------------------------------------------

    let loginId = req.body.fromId;
    let id = req.params.id;
    // console.log(toId);

    // Execute the getMessagesById use case to retrieve a message by ID
    const Messages: Either<ErrorClass, MessageEntity> =
      await this.getByIdMessageUsecase.execute(loginId, id);

    // Handle the result of the use case execution
    Messages.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }), // Handle error case
      (result: MessageEntity) => {
        // Handle success case
        if (!result) {
          return res.json({ message: "message not found." });
        }
        const resData = MessageMapper.toEntity(result);
        return res.json(resData);
      }
    );
  }

  // Handler for getting all Messages
  async getAllMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    //-----------------------------------------------------------------------------
    // let loginId: string = req.body.loginId;
    // loginId = "2";
    //-----------------------------------------------------------------------------

    let loginId = req.body.fromId;

    const query: Query = {}; // Create an empty query object

    // Assign values to properties of the query object
    query.q = req.query.q as string;
    query.page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
    query.limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number
    query.toId = parseInt(req.query.toId as string, 10);
    query.searchList = req.query.search as string;
    // console.log(query);
    // Execute the getAllMessages use case to retrieve all Messages
    const clientMessages: Either<ErrorClass, MessageEntity[]> =
      await this.getAllMessageUsecase.execute(loginId, query);

    // Handle the result of the use case execution
    clientMessages.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }), // Handle error case
      (result: MessageEntity[]) => {
        // Handle success case
        const responseData = result.map((message) =>
          MessageMapper.toEntity(message)
        );
        return res.json(responseData);
      }
    );
  }

  // Handler for updating Messages by ID
  async updateMessages(req: Request, res: Response): Promise<void> {
    //-----------------------------------------------------------------------------
    // let toId: string = req.body.loginId;
    // toId = "1";
    // const fromId: string = req.params.id;
    // const Data: MessageModel = req.body;
    //-----------------------------------------------------------------------------
    const Data: MessageModel = req.body;
    let loginId = req.body.fromId;
    let id = req.params.id;

    // Execute the getMessagesById use case to retrieve existing message data
    const existingMessages: Either<ErrorClass, MessageEntity> =
      await this.getByIdMessageUsecase.execute(loginId, id);

    // Handle the result of retrieving existing data
    existingMessages.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message }); // Handle error case
      },
      async (existingData: MessageEntity) => {
        // Map the updated data to the existing message entity
        const updatedMessageEntity: MessageEntity =
          MessageMapper.toEntity(Data, true, existingData);

        // Execute the updateMessages use case to update the message
        const updatedMessages: Either<ErrorClass, MessageEntity> =
          await this.updateMessageUsecase.execute(
            loginId,
            id,
            updatedMessageEntity
          );

        // Handle the result of the use case execution
        updatedMessages.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message }); // Handle error case
          },
          (result: MessageEntity) => {
            // Handle success case
            const resData = MessageMapper.toEntity(result, true);
            res.json(resData);
          }
        );
      }
    );
  }
}
