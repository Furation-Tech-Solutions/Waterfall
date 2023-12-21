// Define a class for the NotificationModel, representing the structure of data sent in Express API requests
export class NotificationModel {
    constructor(
      public senderId: string = "",
      public receiverId: string = "",
      public message: string = "",
      public senderIdData: {} = {},
      public receiverIdData: {} = {}
    ) {}
  }
  
  // Define a class for the MessageEntity, representing data provided by the Message Repository and converted to an Express API response
  export class NotificationEntity {
    constructor(
      public id: number | undefined = undefined, // Set a default value for id
      public senderId: string,
      public receiverId: string,
      public message: string,
      public senderIdData: {},
      public receiverIdData: {},
      public notificationTime:string
    ) {}
  }
  
  // Define a NotificationMapper class to handle the mapping between NotificationModel and NotificationEnttity
  export class NotificationMapper {
    static toEntity(
      notificationData: any,
      includeId?: boolean,
      existingNotification?: NotificationEntity
    ): NotificationEntity {
      if (existingNotification != null) {
        // If existingMessage is provided, merge the data from messageData with the existingMessage
        return {
          ...existingNotification,
          senderId:
          notificationData.senderId !== undefined
              ? notificationData.senderId
              : existingNotification.senderId,
          receiverId:
          notificationData.receiverId !== undefined
              ? notificationData.receiverId
              : existingNotification.receiverId,
          message:
          notificationData.message !== undefined
              ? notificationData.message
              : existingNotification.message,
          notificationTime: notificationData.createdAt ?? existingNotification.notificationTime,
        };
      } else {
        // If existingMessage is not provided, create a new MessageEntity using messageData
        const notificationEntity: NotificationEntity = {
          id: includeId
            ? notificationData.id
              ? notificationData.id
              : undefined
            : notificationData.id,
          senderId: notificationData.senderId,
          receiverId: notificationData.receiverId,
          message: notificationData.message,
          senderIdData: notificationData.senderIdData,
          receiverIdData: notificationData.receiverIdData,
          notificationTime: notificationData.createdAt,
        };
        return notificationEntity;
      }
    }
  
    // Convert a NotificationEntity to a format suitable for a model
    static toModel(message: NotificationEntity): any {
      return {
        senderId: message.senderId,
        receiverId: message.receiverId,
        message: message.message,
        senderIdData: message.senderIdData,
        receiverIdData: message.receiverIdData,
      };
    }
  }
  