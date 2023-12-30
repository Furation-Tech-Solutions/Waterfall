// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model called 'Message' with three fields: 'sender', 'receiver', and 'message'
const Notification = sequelize.define("Notification", {
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
  // Define the 'notification' field
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
//   seen: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
});
///created at uodtad at inplace of seen

// Establish associations with the 'Realtors' model using foreign keys
Notification.belongsTo(Realtors, { foreignKey: "senderId", as: "senderData" });
Notification.belongsTo(Realtors, { foreignKey: "receiverId", as: "receiverData" });

// Export the 'Notification' model for use in other parts of the application
export default Notification;
