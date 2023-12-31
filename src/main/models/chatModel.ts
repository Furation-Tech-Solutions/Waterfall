// Import necessary dependencies
import { sequelize } from "@main/sequelizeClient";
import { DataTypes } from "sequelize";

// Define the Sequelize model for Chats
const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    chatName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    latestMessageId: {
      type: DataTypes.UUID,
      references: {
        model: "Message",
        key: "id",
      },
    },
    groupAdminId: {
      type: DataTypes.UUID,
      references: {
        model: "Realtors",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Chat; // Export the Chat model as the default export
