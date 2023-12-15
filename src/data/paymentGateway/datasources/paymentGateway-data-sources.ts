// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import {
  PaymentGatewayEntity,
  PaymentGatewayModel,
} from "@domain/paymentGateway/entities/paymentGateway"; // Import the PaymentGatewayModel
import PaymentGateway from "@data/paymentGateway/models/paymentGateway-models"; // Import the PaymentGateway model
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import ApiError from "@presentation/error-handling/api-error";

// Create PaymentGatewayDataSource Interface
export interface PaymentGatewayDataSource {
  // Define methods for data operations on PaymentGateway entities
  create(paymentGateway: any): Promise<PaymentGatewayEntity>;
  update(id: string, paymentGateway: any): Promise<PaymentGatewayEntity>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<PaymentGatewayEntity | null>;
  getAll(): Promise<PaymentGatewayEntity[]>;
}

// PaymentGateway Data Source communicates with the database
export class PaymentGatewayDataSourceImpl implements PaymentGatewayDataSource {
  constructor(private db: Sequelize) {}

  // Implement the "create" method to insert a new PaymentGatewayEntity
  async create(paymentGateway: any): Promise<PaymentGatewayEntity> {
    // Create a new PaymentGatewayEntity record in the database
    const createdPaymentGateway = await PaymentGateway.create(paymentGateway);

    // Return the newly created PaymentGatewayEntity as a plain JavaScript object
    return createdPaymentGateway.toJSON();
  }

  // Implement the "delete" method to remove a PaymentGatewayEntity by ID
  async delete(id: string): Promise<void> {
    // Delete a PaymentGatewayEntity record from the database based on its ID
    await PaymentGateway.destroy({
      where: {
        id: id,
      },
    });
  }

  // Implement the "read" method to retrieve a PaymentGatewayEntity by ID
  async read(id: string): Promise<PaymentGatewayEntity | null> {
    // Find a PaymentGatewayEntity record in the database by its ID
    const paymentGateway = await PaymentGateway.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: JobApplicant,
          foreignKey: "jobApplicantId",
          as: "jobApplicantIdData",
        },
        {
          model: Job,
          foreignKey: "jobId",
          as: "jobIdData",
        },
      ],
      // include: 'tags', // You can include associations here if needed
    });

    // Convert the PaymentGatewayEntity to a plain JavaScript object before returning
    return paymentGateway ? paymentGateway.toJSON() : null;
  }

  // Implement the "getAll" method to retrieve all PaymentGatewayEntity records
  async getAll(): Promise<PaymentGatewayEntity[]> {
    // Retrieve all PaymentGatewayEntity records from the database
    const paymentGateway = await PaymentGateway.findAll({
      include: [
        {
          model: JobApplicant,
          foreignKey: "jobApplicantId",
          as: "jobApplicantIdData",
        },
        {
          model: Job,
          foreignKey: "jobId",
          as: "jobIdData",
        },
      ],
    });

    // Convert the PaymentGatewayEntities to plain JavaScript objects before returning
    return paymentGateway.map((paymentGateway: any) => paymentGateway.toJSON());
  }

  // Implement the "update" method to update a PaymentGatewayEntity by ID
  async update(
    id: string,
    updatedData: any
  ): Promise<PaymentGatewayEntity> {
    // Find the PaymentGatewayEntity record in the database by its ID
    const paymentGateway = await PaymentGateway.findByPk(id);

    // Update the PaymentGatewayEntity record with the provided data
    if (paymentGateway) {
      await paymentGateway.update(updatedData);
    }

    // Fetch the updated PaymentGatewayEntity record
    const updatedPaymentGateway = await PaymentGateway.findByPk(id);

    if (updatedPaymentGateway == null) {
      throw ApiError.notFound();
    }
    return updatedPaymentGateway.toJSON();
  }
}
