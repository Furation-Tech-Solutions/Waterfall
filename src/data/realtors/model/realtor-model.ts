// Import necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model called 'Realtors' with various fields
const Realtors = sequelize.define('Realtors', {
  // Define fields with their data types and constraints
  firstName: { type: DataTypes.STRING, validate: { len: [3, 30] } },
  lastName: { type: DataTypes.STRING, validate: { len: [3, 30] } },
  email: { type: DataTypes.STRING, unique: true },
  contact: { type: DataTypes.INTEGER, unique: true },
  DOB: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  about: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING,  validate: { len: [5, 10] } },
  profileImage: { type: DataTypes.STRING },
  countryCode: { type: DataTypes.INTEGER },
  deleteStatus: { type: DataTypes.BOOLEAN }
});

// An asynchronous self-invoking function for database synchronization
(async () => {
  await sequelize.sync({ force: false });
  
  // Code to be added here for further functionality
  
})();

// Export the 'Realtors' model for use in other parts of the application
export default Realtors;
