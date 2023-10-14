// Import necessary dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model named "SavedJob"
const SavedJob = sequelize.define("SavedJob", {
  // Define a field "Realtor" with a data type of UUID (assuming it's equivalent to ObjectId in PostgreSQL)
  Realtor: {
    type: DataTypes.UUID,
    allowNull: false, // The field cannot be null
  },

  // Define a field "Job" with a data type of UUID (assuming it's equivalent to ObjectId in PostgreSQL)
  Job: {
    type: DataTypes.UUID,
    allowNull: false, // The field cannot be null
  },
});

// Use an immediately invoked async function to ensure the Sequelize model is synchronized with the database
// (async () => {
//   // Synchronize the model with the database ( means don't drop tables if they exist)
//   await sequelize.sync({ force: false });

//   // Code here (you can add code for further database operations if needed)
// })();

// Export the "SavedJob" model as the default export
export default SavedJob;
