// Import necessary dependencies and modules
import { Op, Sequelize } from "sequelize";
import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import Report from "@data/report/models/report-model";
import Realtors from "@data/realtors/model/realtor-model";
import ApiError from "@presentation/error-handling/api-error";

// Define the ReportDataSource interface
export interface ReportDataSource {
  // Method to create a new report
  create(report: any): Promise<ReportEntity>;

  // Method to update an existing report by ID
  update(id: string, report: any): Promise<ReportEntity>;

  // Method to delete a report by ID
  delete(id: string): Promise<void>;

  // Method to read a report by ID
  read(id: string): Promise<ReportEntity | null>;

  // Method to get all reports
  getAll(realtId: string): Promise<ReportEntity[]>;

  check(id: string, loginId: string): Promise<ReportEntity>;
}

// Implementation of the ReportDataSource interface
export class ReportDataSourceImpl implements ReportDataSource {
  constructor(private db: Sequelize) { }

  // Implement the "create" method to add a new report to the database
  async create(report: any): Promise<ReportEntity> {
    // Create a new report record in the database
    const createdReport = await Report.create(report);

    // Get the Realtor ID associated with the created report (assuming it's stored in the report object)
    const realtorId = createdReport.dataValues.toRealtorId; // Replace 'realtorId' with the actual field name

    // Find the associated Realtor using the Realtors model
    const realtor = await Realtors.findByPk(realtorId);

    if (!realtor) {
      // If Realtor not found, handle the error (you can throw an error or handle it accordingly)
      throw new Error('Realtor not found');
    }

    // Increment the reportCount for the Realtor
    await realtor.increment('reportCount');

    // Return the created report as a plain JavaScript object
    return createdReport.toJSON();
  }

  // Implement the "delete" method to remove a report by ID from the database
  async delete(id: string): Promise<void> {

    const report: any = await Report.findOne({
      where: {
        id: id,
      },
    });

    // Delete the report record where the ID matches the provided ID
    const realtorId = report.toRealtorId; // Replace 'realtorId' with the actual field name

    // Find the associated Realtor using the Realtors model
    const realtor = await Realtors.findByPk(realtorId);

    if (!realtor) {
      // If Realtor not found, handle the error (you can throw an error or handle it accordingly)
      throw new Error('Realtor not found');
    }

    // Increment the reportCount for the Realtor
    await realtor.decrement('reportCount');
    
    await Report.destroy({
      where: {
        id: id,
      },
    });
  }

  // Implement the "read" method to retrieve a report by ID from the database
  async read(id: string): Promise<ReportEntity | null> {
    // Find a report record in the database by ID
    const report = await Report.findOne({
      where: {
        id: id,
      },
      // Include associations to retrieve related data
      include: [
        {
          model: Realtors,
          as: "fromRealtorData", // Alias for the first association
          foreignKey: "fromRealtorId",
        },
        {
          model: Realtors,
          as: "toRealtorData", // Alias for the second association
          foreignKey: "toRealtorId",
        },
      ],
    });

    // If a report record is found, convert it to a plain JavaScript object before returning
    return report ? report.toJSON() : null;
  }

  // Implement the "getAll" method to retrieve all reports from the database
  async getAll(realtId: string): Promise<ReportEntity[]> {
    // Find all report records in the database
    const reports = await Report.findAll({
      where: {
        toRealtorId: realtId,
      },
      include: [
        {
          model: Realtors,
          as: 'fromRealtorData', // Include data from the 'Realtors' model associated with fromRealtorId
          attributes: ['id', 'firstName', 'lastName'], // Define specific attributes to retrieve
        },
        {
          model: Realtors,
          as: 'toRealtorData', // Include data from the 'Realtors' model associated with toRealtorId
          attributes: ['id', 'firstName', 'lastName'], // Define specific attributes to retrieve
        },
      ],
    });

    // Convert the array of report records to an array of plain JavaScript objects before returning
    return reports.map((report: any) => report.toJSON());
  }

  // Implement the "update" method to update an existing report by ID in the database
  async update(id: string, updatedData: any): Promise<ReportEntity> {
    // Find the report record in the database by ID
    const report = await Report.findByPk(id);

    // Update the record with the provided data if it exists
    if (report) {
      await report.update(updatedData);
    }

    // Fetch the updated record by ID
    const updatedReport = await Report.findByPk(id);

    if (updatedReport == null) {
      throw ApiError.notFound();
    }
    return updatedReport.toJSON();
  }

  // Retrieve a report by ID
  async check(id: string, loginId: string): Promise<ReportEntity> {
    // console.log(id,loginId);
    const report = await Report.findOne({
      where: {
        [Op.or]: [
          {
            fromRealtorId: id,
            toRealtorId: loginId,
          },
          {
            toRealtorId: id,
            fromRealtorId: loginId,
          },
        ],
      },
    });

    if (report === null) {
      throw ApiError.notFound();
    }

    // If a matching entry is found, convert it to a plain JavaScript object before returning
    return report.toJSON();
  }

}
