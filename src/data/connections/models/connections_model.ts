// import { strict } from "assert";
// import { DataTypes } from "sequelize";
// import env from '@main/config/env';
// import { array, boolean, object, string } from "joi";
// import sequelize from "@main/sequelizeClient";

// import Realtors from "@data/realtors/model/realtor-model";


// const Connections = sequelize.define('Connections', {
//   fromId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: { model: Realtors, key: 'id' }
//   },
//   toId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: { model: Realtors, key: 'id' }
//   },
//   connected: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// });

// Realtors.hasMany(Connections);
// Connections.belongsTo(Realtors, { foreignKey: 'fromId', as: 'fromRealtor' });
// Connections.belongsTo(Realtors, { foreignKey: 'toId', as: 'toRealtor' });

// export default Connections;



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

// Connections.belongsTo(Realtors, { foreignKey: 'fromId', as: 'fromRealtor' });
// Connections.belongsTo(Realtors, { foreignKey: 'toId', as: 'toRealtor' });

// Connections.belongsToMany(Realtors, { foreignKey: 'fromId', as: 'fromRealtor' });
// Connections.belongsTo(Realtors, { foreignKey: 'toId', as: 'toRealtor' });

// Realtors.hasMany(Connections, { foreignKey: 'fromId', as: 'fromConnections' });
// Realtors.hasMany(Connections, { foreignKey: 'toId', as: 'toConnections' });

export default Connections;

