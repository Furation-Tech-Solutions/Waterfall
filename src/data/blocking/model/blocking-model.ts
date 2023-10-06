import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";
import Realtors from "@data/realtors/model/realtor-model";

const Blockings = sequelize.define('Blockings', {
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
  await sequelize.sync({ force: false });
  // Code here
})();

export default Blockings;