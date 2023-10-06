// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model called 'Blocking' with two string fields: 'fromRealtor' and 'toRealtor'
const Blocking = sequelize.define('Blocking', {
  fromRealtor: { type: DataTypes.STRING, allowNull: false, },
  toRealtor: { type: DataTypes.STRING, allowNull: false  }
});

// An asynchronous self-invoking function for database synchronization
(async () => {
  // Synchronize the Sequelize model with the database, and ensure tables are not dropped (force: false)
  await sequelize.sync({ force: false });
  
  // Code to be added here for further functionality
  
})();

// Export the 'Blocking' model for use in other parts of the application
export default Blocking;
