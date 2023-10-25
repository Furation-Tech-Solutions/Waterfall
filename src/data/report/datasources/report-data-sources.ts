// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import Report from "@data/report/models/report-model";
import Realtors from "@data/realtors/model/realtor-model";

// Define the ReportDataSource interface
export interface ReportDataSource {
  // Method to create a new report
  create(report: ReportModel): Promise<ReportEntity>;

  // Method to update an existing report by ID
  update(id: string, report: ReportModel): Promise<any>;

  // Method to delete a report by ID
  delete(id: string): Promise<void>;

  // Method to read a report by ID
  read(id: string): Promise<ReportEntity | null>;

  // Method to get all reports
  getAll(): Promise<ReportEntity[]>;
}

// Implementation of the ReportDataSource interface
export class ReportDataSourceImpl implements ReportDataSource {
  constructor(private db: Sequelize) {}

  // Implement the "create" method to add a new report to the database
  async create(report: any): Promise<ReportEntity> {
    const createdReport = await Report.create(report);

    return createdReport.toJSON();
  }

  // Implement the "delete" method to remove a report by ID from the database
  async delete(id: string): Promise<void> {
    await Report.destroy({
      where: {
        id: id,
      },
    });
  }

  // Implement the "read" method to retrieve a report by ID from the database
  async read(id: string): Promise<ReportEntity | null> {
    const report = await Report.findOne({
      where: {
        id: id,
      },
      // You can include associations here if needed
    });
    return report ? report.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  // Implement the "getAll" method to retrieve all reports from the database
  async getAll(): Promise<ReportEntity[]> {
    const reports = await Report.findAll({
      include: [
        {
          model: Realtors,
          as: "from",
          foreignKey: "fromRealtor",
        },
        {
          model: Realtors,
          as: "to",
          foreignKey: "toRealtor",
        },
      ],
    });
    return reports.map((report: any) => report.toJSON()); // Convert to plain JavaScript objects before returning
  }

  // Implement the "update" method to update an existing report by ID in the database
  async update(id: string, updatedData: ReportModel): Promise<any> {
    // Find the record by ID
    const report = await Report.findByPk(id);

    // Update the record with the provided data
    if (report) {
      await report.update(updatedData);
    }

    // Fetch the updated record
    const updatedReport = await Report.findByPk(id);

    return updatedReport ? updatedReport.toJSON() : null; // Convert to a plain JavaScript object before returning
  }
}
