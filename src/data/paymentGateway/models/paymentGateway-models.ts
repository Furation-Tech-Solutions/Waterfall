// Import necessary dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Job from "@data/job/models/job-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import Realtors from "@data/realtors/model/realtor-model";

// Define payment method options
export const paymentMethodEnum = {
  CREDITCARD: "Credit Card",
  DEBITCARD: "Debit Card",
};

// Define a Sequelize model named "PaymentGateway"
const Transactions = sequelize.define("transactions", {
  // Define a field "jobId" with a data type of INTEGER
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" },
  },

  toRealtorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" },
  },

  fromRealtorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: Realtors, key: "id" },
  },

  // Define a field "amount" with a data type of STRING
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Define a field "paymentMethod" with a data type of ENUM with predefined values
  // paymentMethod: {
  //   type: DataTypes.ENUM(...Object.values(paymentMethodEnum)),
  //   allowNull: false,
  // },

  // Define a field "TransactionId" with a data type of STRING
  transactionId: {
    type: DataTypes.STRING,
    // allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    // allowNull: false,
  },

});

// Define associations with other models
Transactions.belongsTo(Job, {
  foreignKey: "jobId",
  as: "jobData",
});

// Define an association between Job and Realtors (jobOwner)
Transactions.belongsTo(Realtors, {
  foreignKey: "toRealtorId",
  as: "toRealtorData", // Optional alias for the association
});

// Define an association between Job and Realtors (jobOwner)
Transactions.belongsTo(Realtors, {
  foreignKey: "fromRealtorId",
  as: "fromRealtorData", // Optional alias for the association
});

// Export the "PaymentGateway" model as the default export
export default Transactions;
