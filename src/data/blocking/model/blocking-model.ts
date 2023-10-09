// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define a Sequelize model called 'Blocking' with two string fields: 'fromRealtor' and 'toRealtor'
const Blocking = sequelize.define('Blocking', {
  fromRealtor: { type: DataTypes.STRING, allowNull: false, },
  toRealtor: { type: DataTypes.STRING, allowNull: false  }
});


// Define the association between Blockings and Realtor
// Blockings.belongsTo(Realtors, {
//   foreignKey: 'fromRealtor', // The name of the foreign key column in Blockings
//   targetKey: 'id' // The name of the target key column in Realtor
// });

// // Define the association between Blockings and Realtor
// Blockings.belongsTo(Realtors, {
//   foreignKey: 'toRealtor', // The name of the foreign key column in Blockings
//   targetKey: 'id' // The name of the target key column in Realtor
// });

(async () => {
  // Synchronize the Sequelize model with the database, and ensure tables are not dropped (force: false)
  await sequelize.sync({ force: false });
  
  // Code to be added here for further functionality
  
})();

// Export the 'Blocking' model for use in other parts of the application
export default Blocking;
