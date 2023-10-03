import { strict } from "assert";
import { DataTypes } from "sequelize";
import env from '@main/config/env';
import { array, boolean, object, string } from "joi";
import sequelize from "@main/sequalizeClient";

const ClientTagCategory = sequelize.define('ClientTagCategory', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
    },
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});



// Define associations if needed
// ClientTagCategory.hasMany(UserAccount, { foreignKey: 'updatedBy', as: 'UpdatedBy' });


export default ClientTagCategory;