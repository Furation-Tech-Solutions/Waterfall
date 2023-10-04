import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

export const OutcomeEnum = {
  BUSY: "Busy",
  CONNECTED: "Connected",
  LEFTLIVEMESSAGE: "LeftLiveMessage",
  LEFTVOICEMAIL: "LeftVoicemail",
  NOANSWER: "NoAnswer",
  WRONGNUMBER: "WrongNumber",
};
const CallLog = sequelize.define("CallLog", {
  realtor: {
    type: DataTypes.UUID, // Assuming the equivalent of ObjectId in PostgreSQL is UUID
    allowNull: false,
  },
  logActivity: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 500],
        msg: "Log activity length must be between 1 and 500 characters",
      },
    },
  },
  logOutcome: {
    type: DataTypes.ENUM(...Object.values(OutcomeEnum)),
    allowNull: false,
  },
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();

export default CallLog;
