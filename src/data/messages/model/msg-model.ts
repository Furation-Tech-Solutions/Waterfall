// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";
import Connections from "@data/connections/models/connections_model";

export const messageTypeEnum = {
  TEXT: "Text",
  IMAGE: "Image",
  OTHERS: "Others",
};

export const seenEnum = {
  READ: "Read",
  UNREAD: "Unread"
};

// Define a Sequelize model called 'Message' with three fields: 'sender', 'receiver', and 'message'
const Message = sequelize.define("MessageTesting", {
  // Define the 'sender' field
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },
  // Define the 'receiver' field
  receiverId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },
  connectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Connections, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },
  // Define the 'message' field
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  messageType: {
    type: DataTypes.ENUM(...Object.values(messageTypeEnum)),
  },
  status: {
    type: DataTypes.ENUM(...Object.values(seenEnum)),

  },
});

// Establish associations with the 'Realtors' model using foreign keys
Message.belongsTo(Realtors, { foreignKey: "senderId", as: "senderData" });
Message.belongsTo(Realtors, { foreignKey: "receiverId", as: "receiverData" });

Connections.hasMany(Message, {
  foreignKey: "connectionId",
  as: "messagesData",
});

// Export the 'Message' model for use in other parts of the application
export default Message;
