import { Sequelize } from "sequelize";
import { ReportEntity, ReportModel } from "@domain/report/entities/report"; // Import the JobModel
import Report from "@data/report/models/report-model";

// Create ReportDataSource Interface
export interface ReportDataSource {
  create(report: ReportModel): Promise<ReportEntity>;
  update(id: string, report: ReportModel): Promise<any>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<ReportEntity | null>;
  getAll(): Promise<ReportEntity[]>;
}

// Report Data Source communicates with the database
export class ReportDataSourceImpl implements ReportDataSource {
  constructor(private db: Sequelize) {}

  async create(report: any): Promise<ReportEntity> {
    const createdReport = await Report.create(report);

    return createdReport.toJSON();
  }

  async delete(id: string): Promise<void> {
    await Report.destroy({
      where: {
        id: id,
      },
    });
  }

  async read(id: string): Promise<ReportEntity | null> {
    const report = await Report.findOne({
      where: {
        id: id,
      },
      // include: 'tags', // Replace 'tags' with the actual name of your association
    });
    return report ? report.toJSON() : null; // Convert to a plain JavaScript object before returning
  }

  async getAll(): Promise<ReportEntity[]> {
    const report = await Report.findAll({});
    return report.map((report: any) => report.toJSON()); // Convert to plain JavaScript objects before returning
  }

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

