// Import the Sequelize library for database interaction
import { Sequelize } from "sequelize";
import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog"; // Import the CallLogModel
import CallLog from "@data/callLog/models/callLog-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import ApiError from "@presentation/error-handling/api-error";

// Create CallLogDataSource Interface
export interface CallLogDataSource {
  // Method to create a new call log
  create(callLog: any): Promise<CallLogEntity>;

  // Method to update an existing call log by ID
  update(id: string, callLog: any): Promise<CallLogEntity>;

  // Method to delete a call log by ID
  delete(id: string): Promise<void>;

  // Method to read a call log by ID
  read(id: string): Promise<CallLogEntity | null>;

  // Method to retrieve all call logs
  getAll(query: CallLogQuery): Promise<CallLogEntity[]>;
}

// Define a CallLogQuery object to encapsulate parameters
export interface CallLogQuery {
  id: number;
  page: number;
  limit: number;
}

// CallLog Data Source communicates with the database
export class CallLogDataSourceImpl implements CallLogDataSource {
  constructor(private db: Sequelize) { }

  // Method to create a new call log
  async create(callLog: any): Promise<CallLogEntity> {
    // Create a new call log record in the database
    const createdCallLog = await CallLog.create(callLog);

    // Convert the created call log to a plain JavaScript object before returning
    return createdCallLog.toJSON();
  }

  // Method to delete a call log by ID
  async delete(id: string): Promise<void> {
    // Delete the call log record from the database by ID
    await CallLog.destroy({
      where: {
        id: id,
      },
    });
  }

  // Method to read a call log by ID
  async read(id: string): Promise<CallLogEntity | null> {
    // Find a call log record in the database by ID
    const callLog = await CallLog.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: JobApplicant,
          foreignKey: "jobApplicantId",
          as: "jobApplicantIdData"
        },
      ],
      // include: 'tags', // Replace 'tags' with the actual name of your association if needed
    });

    // Convert the found call log to a plain JavaScript object before returning
    return callLog ? callLog.toJSON() : null;
  }

  // Method to retrieve all call logs
  async getAll(query: CallLogQuery): Promise<CallLogEntity[]> {
    let loginId = query.id;
    // Set defaults for pagination
    const currentPage = query.page || 1; // Default to page 1
    const itemsPerPage = query.limit || 10; // Default to 10 items per page

    // Calculate the offset based on the current page
    const offset = (currentPage - 1) * itemsPerPage;

    // Retrieve all call log records from the database with pagination
    const callLog = await CallLog.findAll({
      include: [
        {
          model: JobApplicant,
          foreignKey: "jobApplicantId",
          as: "jobApplicantIdData",
          where: {
            applicantId: loginId
          },
        },
      ],
      limit: itemsPerPage, // Limit the number of results per page
      offset: offset, // Calculate the offset based on the current page
    });

    // Convert the retrieved call logs to an array of plain JavaScript objects before returning
    return callLog.map((callLog: any) => callLog.toJSON());
  }

  // Method to update an existing call log by ID
  async update(id: string, updatedData: any): Promise<CallLogEntity> {
    // Find the call log record in the database by ID
    const callLog = await CallLog.findByPk(id);

    // Update the call log record with the provided data if it exists
    if (callLog) {
      await callLog.update(updatedData);
    }

    // Fetch the updated call log record
    const updatedCallLog = await CallLog.findByPk(id);

    if (updatedCallLog == null) {
      throw ApiError.notFound();
    }
    return updatedCallLog.toJSON();
  }
}
