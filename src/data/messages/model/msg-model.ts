// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model called 'Message' with three fields: 'sender', 'receiver', and 'message'
const Message = sequelize.define("Message", {
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

// Establish associations with the 'Realtors' model using foreign keys
Message.belongsTo(Realtors, { foreignKey: "senderId", as: "senderIdData" });
Message.belongsTo(Realtors, { foreignKey: "receiverId", as: "receiverIdData" });

// Export the 'Message' model for use in other parts of the application
export default Message;
