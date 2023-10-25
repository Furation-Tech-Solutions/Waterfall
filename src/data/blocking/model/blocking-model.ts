// Import the necessary modules and dependencies
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";

// Define a Sequelize model called 'Blocking' with two string fields: 'fromRealtor' and 'toRealtor'
const Blocking = sequelize.define('Blocking', {
  fromRealtor: { type: DataTypes.INTEGER, allowNull: false, references: { model: Realtors, key: 'id' } },
  toRealtor: { type: DataTypes.INTEGER, allowNull: false, references: { model: Realtors, key: 'id' } }
});

// Realtors.hasMany(Blocking);
Blocking.belongsTo(Realtors, {
  foreignKey: "fromRealtor",
  as: "from" // Alias for the first association
});

Blocking.belongsTo(Realtors, {
  foreignKey: "toRealtor",
  as: "to" // Alias for the second association
});

// Export the 'Blocking' model for use in other parts of the application
export default Blocking;
