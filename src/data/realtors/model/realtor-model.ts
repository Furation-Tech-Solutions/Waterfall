import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

const Realtors = sequelize.define('Realtors', {
  firstName: { type: DataTypes.STRING, allowNull: false,  validate: { len: [3, 30] } },
  lastName: { type: DataTypes.STRING, allowNull: false,  validate: { len: [3, 30] } },
  email: { type: DataTypes.STRING, allowNull: false, unique:true},
  contact: { type: DataTypes.INTEGER, allowNull: false,  unique:true},
  DOB: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  about: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false,  validate: { len: [5,10] } },
  profileImage: { type: DataTypes.STRING, allowNull: false },
  countryCode: { type: DataTypes.INTEGER, allowNull: false },
  deleteStatus: { type: DataTypes.BOOLEAN }
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default Realtors;