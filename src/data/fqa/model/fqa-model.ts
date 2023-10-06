// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model called 'FQAs' with two string fields: 'question' and 'answer'
const FQAs = sequelize.define('FQAs', {
  question: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.STRING, allowNull: false }
});

// An asynchronous self-invoking function for database synchronization
(async () => {
  await sequelize.sync({ force: false });
  
  // Code to be added here for further functionality
  
})();

// Export the 'FQAs' model for use in other parts of the application
export default FQAs;
