// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model called 'Message' with three fields: 'sender', 'receiver', and 'message'
const Message = sequelize.define('Message', {
  // Define the 'sender' field
  sender: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },
  // Define the 'receiver' field
  receiver: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: "id" }, // Reference the 'id' field of the 'Realtors' model
  },
  // Define the 'message' field
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Establish associations with the 'Realtors' model using foreign keys
Message.belongsTo(Realtors, { foreignKey: "sender", as: "senderData" });
Message.belongsTo(Realtors, { foreignKey: "receiver", as: "receiverData" });

// Export the 'Message' model for use in other parts of the application
export default Message;
