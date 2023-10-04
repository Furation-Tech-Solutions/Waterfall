import { DataTypes } from "sequelize";
import sequelize from "@main/sequalizeClient";

const FQAs = sequelize.define('FQAs', {
  question: { type: DataTypes.STRING, allowNull: false, },
  answer: { type: DataTypes.STRING, allowNull: false  }
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default FQAs;