// Import necessary modules and dependencies
import { Op, Sequelize, where } from "sequelize";
import { MessageEntity, MessageModel } from "@domain/messages/entities/msg"; // Import the MessageModel
import ApiError from "@presentation/error-handling/api-error";
import Realtors from "@data/realtors/model/realtor-model";
import Blocking from "@data/blocking/model/blocking-model";
import { NotificationEntity, NotificationModel } from "@domain/notification/entities/notification_entity";
import Notification from "../model/notification-model";



// Create MessageDataSource Interface
export interface NotificationDataSource {
  createNotification(msg: NotificationModel): Promise<any>;
  deleteNotification(id: string): Promise<void>;
  read(id: string): Promise<any | null>;
  getAll(loginId: string): Promise<NotificationEntity[]>;

}

// Message Data Source communicates with the database
export class NotificationDataSourceImpl implements NotificationDataSource {
  constructor(private db: Sequelize) {}

  async createNotification(notificationData: any): Promise<NotificationEntity> {
    // Check if the sender and receiver are blocked
    console.log(notificationData,"inside dtsrc1")
    const isBlocked = await Blocking.findOne({
      where: {
        [Op.or]: [
          {
            fromRealtorId: notificationData.senderId,
            toRealtorId: notificationData.receiverId,
          },
          {
            fromRealtorId: notificationData.receiverId,
            toRealtorId: notificationData.senderId,
          },
        ],
      },
    });

    if (isBlocked) {
      throw new Error(
        "notification cannot be created as senderId or receiverId is blocked."
      );
    }

    // Create a new message record using the provided data
    console.log(notificationData,"inside dtsrc2")

    const createdNotification = await Notification.create(notificationData);
    return createdNotification.toJSON();
  }

  async deleteNotification(id: string): Promise<void> {
    // Delete the message record where the ID matches the provided ID
    const deletedNotification = await Notification.destroy({
      where: {
        id,
      },
    });
  }

  async read(id: string): Promise<NotificationEntity> {
    // Read a message record by ID
    const notificationData = await Notification.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Realtors,
          as: "senderIdData", // Alias for the first association
          foreignKey: "senderId",
        },
        {
          model: Realtors,
          as: "receiverIdData", // Alias for the second association
          foreignKey: "receiverId",
        },
      ],
    });
    if (notificationData === null) {
      throw ApiError.notFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return notificationData.toJSON();
  }

  async getAll(loginId: string): Promise<NotificationEntity[]> {
    // Get all message records based on the provided query parameters
    
  console.log("inside datasource",loginId)
  // const data=await Notification.findAll({})
  
      const data = await Notification.findAll({
        where: {
          receiverId: loginId
        },
        include: [
          {
            model: Realtors,
            as: "senderIdData",
            foreignKey: "senderId",
          },
          {
            model: Realtors,
            as: "receiverIdData",
            foreignKey: "receiverId",
          },
        ],
       
      });
      console.log(data,"data inside dtsrc")
      return data.map((notificationData: any) => notificationData.toJSON());
    }





  
}
