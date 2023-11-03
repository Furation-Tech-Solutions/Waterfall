// Define a class for the MessageModel, representing the structure of data sent in Express API requests
export class MessageModel {
  constructor(
    public sender: string = '',
    public receiver: string = '',
    public message: string = ''
  ) { }
}

// Define a class for the MessageEntity, representing data provided by the Message Repository and converted to an Express API response
export class MessageEntity {
  constructor(
    public id: number | undefined = undefined, // Set a default value for id
    public sender: string,
    public receiver: string,
    public message: string
  ) { }
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
        sender: messageData.sender !== undefined ? messageData.sender : existingMessage.sender,
        receiver: messageData.receiver !== undefined ? messageData.receiver : existingMessage.receiver,
        message: messageData.message !== undefined ? messageData.message : existingMessage.message
      };
    } else {
      // If existingMessage is not provided, create a new MessageEntity using messageData
      const messageEntity: MessageEntity = {
        id: includeId ? (messageData.id ? messageData.id : undefined) : messageData.id,
        sender: messageData.sender,
        receiver: messageData.receiver,
        message: messageData.message
      };
      return messageEntity;
    }
  }

  // Convert a MessageEntity to a format suitable for a model
  static toModel(message: MessageEntity): any {
    return {
      sender: message.sender,
      receiver: message.receiver,
      message: message.message
    };
  }
}
