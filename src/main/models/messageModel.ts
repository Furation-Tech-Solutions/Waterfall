// Import necessary dependencies
import { sequelize } from "@main/sequelizeClient";
import { DataTypes } from "sequelize";

// Define the Sequelize model for Messages
const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      references: {
        model: "Realtors",
        key: "id",
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatId: {
      type: DataTypes.UUID,
      references: {
        model: "Chat",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Message; // Export the Message model as the default export
