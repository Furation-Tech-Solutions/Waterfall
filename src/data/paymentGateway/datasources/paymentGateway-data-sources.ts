// Import necessary dependencies and modules
import { Sequelize } from "sequelize";
import { PaymentGatewayEntity, PaymentGatewayModel } from "@domain/paymentGateway/entities/paymentGateway"; // Import the PaymentGatewayModel
import PaymentGateway from "@data/paymentGateway/models/paymentGateway-models"; // Import the PaymentGateway model
import Realtors from "@data/realtors/model/realtor-model";


// Create PaymentGatewayDataSource Interface
export interface PaymentGatewayDataSource {
  // Define methods for data operations on PaymentGateway entities
  create(paymentGateway: PaymentGatewayModel): Promise<PaymentGatewayEntity>;
  update(id: string, paymentGateway: PaymentGatewayModel): Promise<any>;
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
      // include: 'tags', // You can include associations here if needed
    });

    // Convert the PaymentGatewayEntity to a plain JavaScript object before returning
    return paymentGateway ? paymentGateway.toJSON() : null;
  }

  // Implement the "getAll" method to retrieve all PaymentGatewayEntity records
  async getAll(): Promise<PaymentGatewayEntity[]> {
    // Retrieve all PaymentGatewayEntity records from the database
    const paymentGateway = await PaymentGateway.findAll({});

    // Convert the PaymentGatewayEntities to plain JavaScript objects before returning
    return paymentGateway.map((paymentGateway: any) => paymentGateway.toJSON());
  }

  // Implement the "update" method to update a PaymentGatewayEntity by ID
  async update(id: string, updatedData: PaymentGatewayModel): Promise<any> {
    // Find the PaymentGatewayEntity record in the database by its ID
    const paymentGateway = await PaymentGateway.findByPk(id);

    // Update the PaymentGatewayEntity record with the provided data
    if (paymentGateway) {
      await paymentGateway.update(updatedData);
    }

    // Fetch the updated PaymentGatewayEntity record
    const updatedPaymentGateway = await PaymentGateway.findByPk(id);

    // Convert the updated PaymentGatewayEntity to a plain JavaScript object before returning
    return updatedPaymentGateway ? updatedPaymentGateway.toJSON() : null;
  }
}
