import { DataTypes } from "sequelize";
import sequelize from "@main/sequelizeClient";

const statusEnum = {
  ACCEPT: "Accept",
  PENDING: "Pending",
  DECLINE: "Decline",
};

const JobApplicant = sequelize.define("JobApplicant", {
  job: {
    type: DataTypes.UUID, // Assuming 'Job' is represented by UUID in PostgreSQL
    allowNull: false,
    references: {
      model: "Job", // Replace with the actual name of the 'Job' table
      key: "id", // Replace with the actual primary key of the 'Job' table
    },
  },
  applicant: {
    type: DataTypes.UUID, // Assuming 'Realtor' is represented by UUID in PostgreSQL
    allowNull: false,
    references: {
      model: "Realtor", // Replace with the actual name of the 'Realtor' table
      key: "id", // Replace with the actual primary key of the 'Realtor' table
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
    validate: {
      isIn: {
        args: [Object.values(statusEnum)],
        msg: "Invalid status",
      },
    },
  },
  appliedTimestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // agreement: {
  //     type: DataTypes.UUID, // Assuming 'Agreement' is represented by UUID in PostgreSQL
  //     references: {
  //         model: 'Agreement', // Replace with the actual name of the 'Agreement' table
  //         key: 'id', // Replace with the actual primary key of the 'Agreement' table
  //     },
  // },
});

export default JobApplicant;
