// Import Sequelize data types and the sequelize client
import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

// Define an enum for possible outcomes
export const OutcomeEnum = {
  BUSY: "Busy",
  CONNECTED: "Connected",
  LEFTLIVEMESSAGE: "LeftLiveMessage",
  LEFTVOICEMAIL: "LeftVoicemail",
  NOANSWER: "NoAnswer",
  WRONGNUMBER: "WrongNumber",
};

// Define a Sequelize model called "CallLog"
const CallLog = sequelize.define("CallLog", {
  // Define the "jobApplicant" field with a INTEGER data type, which cannot be null
  jobApplicant: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Define the "logActivity" field with a STRING data type, not null, and length validation
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
  // Define the "logOutcome" field with an ENUM data type based on OutcomeEnum values, not null
  logOutcome: {
    type: DataTypes.ENUM(...Object.values(OutcomeEnum)),
    allowNull: false,
  },
});

// Asynchronous self-invoking function for syncing the Sequelize model with the database
// (async () => {
//   // Sync the model with the database (create the table if it doesn't exist)
//   await sequelize.sync({force: false });

//   // Code to be executed after syncing (if needed) can be placed here
// })();

// Export the CallLog model as the default export
export default CallLog;
