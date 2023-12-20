// Import necessary dependencies
import { DataTypes } from "sequelize";
import { sequelize } from "@main/sequelizeClient";
import Job from "@data/job/models/job-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";

// Define payment method options
export const paymentMethodEnum = {
  CREDITCARD: "Credit Card",
  DEBITCARD: "Debit Card",
  PAYPAL: "Paypal",
  BANKTRANSFER: "Bank Transfer",
};

// Define a Sequelize model named "PaymentGateway"
const PaymentGateway = sequelize.define("PaymentGateway", {
  // Define a field "jobId" with a data type of INTEGER
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" },
  },

  // Define a field "jobApplicantId" with a data type of INTEGER
  jobApplicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: JobApplicant, key: "id" },
  },

  // Define a field "amount" with a data type of STRING
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Define a field "paymentMethod" with a data type of ENUM with predefined values
  paymentMethod: {
    type: DataTypes.ENUM(...Object.values(paymentMethodEnum)),
    allowNull: false,
  },
});

// Define associations with other models
PaymentGateway.belongsTo(Job, {
  foreignKey: "jobId",
  as: "jobData",
});

PaymentGateway.belongsTo(JobApplicant, {
  foreignKey: "jobApplicantId",
  as: "jobApplicantData",
});

// Export the "PaymentGateway" model as the default export
export default PaymentGateway;
