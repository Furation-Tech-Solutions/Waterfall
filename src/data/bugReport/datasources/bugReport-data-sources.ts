// Import the Sequelize library for database interaction
import { Sequelize } from "sequelize";
import {
  BugReportEntity,
  BugReportModel,
} from "@domain/bugReport/entities/bugReport"; // Import the BugReportModel
import BugReport from "@data/bugReport/models/bugReport-model";
import Realtors from "@data/realtors/model/realtor-model";

// Create an interface for the BugReportDataSource
export interface BugReportDataSource {
  // Define methods for data operations with promises
  create(bugReport: BugReportModel): Promise<BugReportEntity>;
  update(id: string, bugReport: BugReportModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<BugReportEntity | null>;
  getAll(): Promise<BugReportEntity[]>;
}

// Implementation of the BugReportDataSource interface
export class BugReportDataSourceImpl implements BugReportDataSource {
  constructor(private db: Sequelize) {} // Constructor that accepts a Sequelize instance

  // Method to create a new bug report in the database
  async create(bugReport: any): Promise<BugReportEntity> {
    // Create a new record in the BugReport table using the provided data
    const createdBugReport = await BugReport.create(bugReport);

    return createdBugReport.toJSON(); // Return the created record as a plain JavaScript object
  }

  // Method to delete a bug report from the database by ID
  async delete(id: string): Promise<void> {
    // Delete the record from the BugReport table where the ID matches
    await BugReport.destroy({
      where: {
        id: id,
      },
    });
  }

  // Method to read a bug report from the database by ID
  async read(id: string): Promise<BugReportEntity | null> {
    // Find a bug report record in the BugReport table where the ID matches
    const bugReport = await BugReport.findOne({
      where: {
        id: id,
      },
      // You can uncomment the "include" option if there are associations to load
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });

    return bugReport ? bugReport.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Method to retrieve all bug reports from the database
  async getAll(): Promise<BugReportEntity[]> {
    // Retrieve all records from the BugReport table
    const bugReport = await BugReport.findAll({
      include: [
        {
          model: Realtors,
          as: "realtorData",
          foreignKey: "realtor",
        },
      ],
    });

    return bugReport.map((bugReport: any) => bugReport.toJSON()); // Convert to plain JavaScript objects before returning
  }

  // Method to update a bug report in the database by ID
  async update(id: string, updatedData: BugReportModel): Promise<any> {
    // Find the bug report record by ID
    const bugReport = await BugReport.findByPk(id);

    // Update the record with the provided data
    if (bugReport) {
      await bugReport.update(updatedData);
    }

    // Fetch the updated record
    const updatedBugReport = await BugReport.findByPk(id);

    return updatedBugReport ? updatedBugReport.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}
