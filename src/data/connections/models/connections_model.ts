import { strict } from "assert";
import { DataTypes } from "sequelize";
import env from '@main/config/env';
import { array, boolean, object, string } from "joi";
import sequelize from "@main/sequelizeClient";

import Realtors from "@data/realtors/model/realtor-model";


const Connections = sequelize.define('Connections', {
  fromId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: 'id' }
  },
  toId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Realtors, key: 'id' }
  },
  connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Connections.belongsTo(Realtors, {
    foreignKey: "fromId",
    as: "from" // Alias for the first association
});

Connections.belongsTo(Realtors, {
    foreignKey: "toId",
    as: "to" // Alias for the second association
});



export default Connections;

