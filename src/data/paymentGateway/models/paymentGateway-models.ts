import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";
import Job from "@data/job/models/job-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";

export const paymentMethodEnum = {
  CREDITCARD: "Credit Card",
  DEBITCARD: "Debit Card",
  PAYPAL: "Paypal",
  BANKTRANSFER: "Bank Transfer",
};

const PaymentGateway = sequelize.define("PaymentGateway", {
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Job, key: "id" },
  },

  jobApplicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: JobApplicant, key: "id" },
  },

  amount: {
    type: DataTypes.STRING, // Data type for amount is STRING
    allowNull: false, // It cannot be null
  },

  paymentMethod: {
    type: DataTypes.ENUM(...Object.values(paymentMethodEnum)), // Data type for jobType is ENUM with predefined values
    allowNull: false,
  },
});

export default PaymentGateway;
