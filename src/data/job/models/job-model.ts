import { DataTypes, Model } from "sequelize"; // Importing DataTypes from Sequelize library
import { Sequelize } from "sequelize/types"; // Importing the Sequelize instance with proper type
import Realtors from "@data/realtors/model/realtor-model";

// Define enums for specific values
enum NumberOfApplicantsEnum {
  FROM1TO5 = "1To5",
  FROM5TO10 = "5To10",
  FROM10TO15 = "10To15",
  FROM15TO20 = "15To20",
  FROM20TO25 = "20To25",
  FROM25TO30 = "25To30",
}

enum JobTypeEnum {
  SHOWINGPROPERTYtTOCLIENT = "Showing property to client",
  ONETIMEVISIT = "One time visit",
  HELPWITHOPENHOUSE = "Help with open house",
  WRITINGCMA = "Writing CMA",
  WRITINGANOFFER = "Writing an offer",
  HELPINGWITHMOREINSPECTION = "Helping with more inspection",
  OTHERS = "Others",
}

enum FeeTypeEnum {
  FIXRATE = "Fix Rate",
  FLATFEE = "Flat Fee",
}

// Define a Sequelize model named "Job"
interface JobAttributes {
  jobOwner: number;
  location: string;
  address: string;
  date: Date;
  numberOfApplicants: NumberOfApplicantsEnum;
  fromTime: string;
  toTime: string;
  jobType: JobTypeEnum;
  clientEmail: string;
  clientPhoneNumber: string;
  feeType: FeeTypeEnum;
  fee: string;
  description: string;
  attachments: string[] | null;
  applyBy: Date;
  createdAt: Date;
  deleteReason: string;
  coordinates: Record<string, any> | null;
  jobApplicants: Record<string, any>[] | null;
}

type JobCreationAttributes = Optional<JobAttributes, "attachments" | "coordinates" | "jobApplicants">;

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public jobOwner!: number;
  public location!: string;
  public address!: string;
  public date!: Date;
  public numberOfApplicants!: NumberOfApplicantsEnum;
  public fromTime!: string;
  public toTime!: string;
  public jobType!: JobTypeEnum;
  public clientEmail!: string;
  public clientPhoneNumber!: string;
  public feeType!: FeeTypeEnum;
  public fee!: string;
  public description!: string;
  public attachments!: string[] | null;
  public applyBy!: Date;
  public createdAt!: Date;
  public deleteReason!: string;
  public coordinates!: Record<string, any> | null;
  public jobApplicants!: Record<string, any>[] | null;
}

export default () => {
  Job.init(
    {
      jobOwner: {
        type: DataTypes.INTEGER, // Data type for jobOwner is INTEGER
        allowNull: false, // It cannot be null
        references: { model: Realtors, key: "id" },
      },
      location: {
        type: DataTypes.STRING, // Data type for location is STRING
        allowNull: false, // It cannot be null
      },
      address: {
        type: DataTypes.STRING, // Data type for address is STRING
        allowNull: false, // It cannot be null
      },
      date: {
        type: DataTypes.DATE, // Data type for date is DATE
        allowNull: false, // It cannot be null
      },
      numberOfApplicants: {
        type: DataTypes.ENUM(...Object.values(NumberOfApplicantsEnum)), // Data type for numberOfApplicants is ENUM with predefined values
        allowNull: false, // It cannot be null
      },
      fromTime: {
        type: DataTypes.STRING, // Data type for fromTime is STRING
        allowNull: false, // It cannot be null
      },
      toTime: {
        type: DataTypes.STRING, // Data type for toTime is STRING
        allowNull: false, // It cannot be null
      },
      jobType: {
        type: DataTypes.ENUM(...Object.values(JobTypeEnum)), // Data type for jobType is ENUM with predefined values
        allowNull: false, // It cannot be null
      },
      clientEmail: {
        type: DataTypes.STRING, // Data type for clientEmail is STRING
        allowNull: false, // It cannot be null
      },
      clientPhoneNumber: {
        type: DataTypes.STRING, // Data type for clientPhoneNumber is STRING
        allowNull: false, // It cannot be null
      },
      feeType: {
        type: DataTypes.ENUM(...Object.values(FeeTypeEnum)), // Data type for feeType is ENUM with predefined values
        allowNull: false, // It cannot be null
      },
      fee: {
        type: DataTypes.STRING, // Data type for fee is STRING
        allowNull: false, // It cannot be null
      },
      description: {
        type: DataTypes.STRING, // Data type for description is STRING
        allowNull: false, // It cannot be null
      },
      attachments: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Data type for attachments is an ARRAY of STRINGS
        allowNull: true, // It can be null
      },
      applyBy: {
        type: DataTypes.DATE, // Data type for applyBy is DATE
        allowNull: false, // It cannot be null
      },
      createdAt: {
        type: DataTypes.DATE, // Data type for createdAt is DATE
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"), // Default value is the current timestamp
        allowNull: false, // It cannot be null
      },
      deleteReason: {
        type: DataTypes.STRING, // Data type for deleteReason is STRING
        allowNull: false, // It cannot be null
      },
      coordinates: {
        type: DataTypes.JSONB, // Use JSONB type for better performance and flexibility
        allowNull: true, // Set to allowNull: true if coordinates are optional
      },
      jobApplicants: {
        type: DataTypes.ARRAY(DataTypes.JSONB), // Use JSONB to store an array of JobApplicant objects
        allowNull: true, // Set to true if jobApplicants are optional
        defaultValue: [],
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Job",
    }
  );

  return Job;
};
