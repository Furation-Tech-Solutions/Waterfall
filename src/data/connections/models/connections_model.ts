import { strict } from "assert";
import { DataTypes } from "sequelize";
import env from '@main/config/env';
import { array, boolean, object, string } from "joi";
import sequelize from "@main/sequelizeClient";


const Connections = sequelize.define('Connections', {
  fromId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define associations if needed
// Connections.hasMany(UserAccount, { foreignKey: 'updatedBy', as: 'UpdatedBy' });

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default Connections;