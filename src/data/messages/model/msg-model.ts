// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";
import Chat from "@data/chat/models/chat-models";

// Define a Sequelize model called 'Message' with three fields: 'sender', 'receiver', and 'message'
 const Message = sequelize.define("Message", {
  // Define the 'receiver' field
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Chat, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },

  // Define the 'message' field
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});


Chat.hasMany(Message, { foreignKey: "chatId", as: "chatData" });


// Export the 'Message' model for use in other parts of the application
export default Message;
