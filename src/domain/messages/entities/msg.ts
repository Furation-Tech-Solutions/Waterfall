// Define a class for the MessageModel, representing the structure of data sent in Express API requests
export class MessageModel {
  constructor(
    public senderId: string = "",
    public receiverId: string = "",
    public message: string = "",
    public senderData: {} = {},
    public receiverData: {} = {}
  ) {}
}

// Define a class for the MessageEntity, representing data provided by the Message Repository and converted to an Express API response
export class MessageEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public senderId: string,
    public receiverId: string,
    public message: string,
    public senderData: {},
    public receiverData: {}
  ) {}
}

// Define a MessageMapper class to handle the mapping between MessageModel and MessageEntity
export class MessageMapper {
  static toEntity(
    messageData: any,
    includeId?: boolean,
    existingMessage?: MessageEntity
  ): MessageEntity {
    if (existingMessage != null) {
      // If existingMessage is provided, merge the data from messageData with the existingMessage
      return {
        ...existingMessage,
        senderId:
          messageData.senderId !== undefined
            ? messageData.senderId
            : existingMessage.senderId,
        receiverId:
          messageData.receiverId !== undefined
            ? messageData.receiverId
            : existingMessage.receiverId,
        message:
          messageData.message !== undefined
            ? messageData.message
            : existingMessage.message,
      };
    } else {
      // If existingMessage is not provided, create a new MessageEntity using messageData
      const messageEntity: MessageEntity = {
        id: includeId
          ? messageData.id
            ? messageData.id
            : undefined
          : messageData.id,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        message: messageData.message,
        senderData: messageData.senderData,
        receiverData: messageData.receiverData,
      };
      return messageEntity;
    }
  }

  // Convert a MessageEntity to a format suitable for a model
  static toModel(message: MessageEntity): any {
    return {
      senderId: message.senderId,
      receiverId: message.receiverId,
      message: message.message,
      senderData: message.senderData,
      receiverData: message.receiverData,
    };
  }
}
