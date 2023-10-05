import { Sequelize } from "sequelize";
import { BugReportEntity, BugReportModel } from "@domain/bugReport/entities/bugReport"; // Import the BugReportModel
import BugReport from "@data/bugReport/models/bugReport-model";

// Create BugReportDataSource Interface
export interface BugReportDataSource {
  create(bugReport: BugReportModel): Promise<BugReportEntity>;
  update(id: string, bugReport: BugReportModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<BugReportEntity | null>;
  getAll(): Promise<BugReportEntity[]>;
}

// BugReport Data Source communicates with the database
export class BugReportDataSourceImpl implements BugReportDataSource {
  constructor(private db: Sequelize) {}

  async create(bugReport: any): Promise<BugReportEntity> {
    const createdBugReport = await BugReport.create(bugReport);

    return createdBugReport.toJSON();
  }

  async delete(id: string): Promise<void> {
    await BugReport.destroy({
      where: {
        id: id,
      },
    });
  }

  async read(id: string): Promise<BugReportEntity | null> {
    const bugReport = await BugReport.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return bugReport ? bugReport.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<BugReportEntity[]> {
    const bugReport = await BugReport.findAll({});
    return bugReport.map((bugReport: any) => bugReport.toJSON()); // Convert to plain JavaScript objects before returning
  }

  async update(id: string, updatedData: BugReportModel): Promise<any> {
    // Find the record by ID
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


