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
import Realtor from "@data/realtors/model/realtor-model";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51OL6H0IZoxttFA7OkUh1eTIgn2aX2GDIw3GPrUk37pQOHzCgyRpgb691kMcBiy90qkbdxbaTP7kmERH9I4iFFzTc00ndt8cjPR');


// Create PaymentGatewayDataSource Interface
export interface PaymentGatewayDataSource {
  // Define methods for data operations on PaymentGateway entities
  create(paymentGateway: any): Promise<PaymentGatewayEntity>;
  update(id: string, paymentGateway: any): Promise<PaymentGatewayEntity>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<PaymentGatewayEntity | null>;
  getAll(): Promise<PaymentGatewayEntity[]>;
  createAccount(loginId: string, data: any): Promise<any>;
  retrieveAcc(loginId: string): Promise<any>;
  updateAcc(loginId: string, data: any): Promise<any>;
  deleteAcc(loginId: string): Promise<any>;
  generateAccLink(loginId: string): Promise<any>;
  prosPayment(loginId: string, data: any): Promise<any>;
  dash(loginId: string): Promise<any>;
  cBalance(loginId: string): Promise<any>;
  trans(loginId: string): Promise<any>;

}

// PaymentGateway Data Source communicates with the database
export class PaymentGatewayDataSourceImpl implements PaymentGatewayDataSource {
  constructor(private db: Sequelize) { }

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
          as: "jobApplicantData",
        },
        {
          model: Job,
          foreignKey: "jobId",
          as: "jobData",
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
          as: "jobApplicantData",
        },
        {
          model: Job,
          foreignKey: "jobId",
          as: "jobData",
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

  // Define a method to create a Connect Express account
  async createAccount(loginId: string, data: any): Promise<any> {

    console.log(loginId, "ds");
    // Create Connect Express account
    const connectExpressAccount: any = await stripe.accounts.create({
      type: 'express',
      country: 'CA', // Replace with the country of the connected account
      email: data.email, // Use the email from the request body
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      business_type: 'individual',
      individual: {
        email: data.email
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'manual',
          },
        },
      },

    });

    const realtor = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });

    // Update the record with the provided data if it exists
    if (realtor) {
      await realtor.update({ connectedAccountId: connectExpressAccount.id });
    }


    console.log('Connect Express account created:', connectExpressAccount);

    if (!connectExpressAccount.id) {
      throw new Error('Failed to create Connect Express account');
    };

    return connectExpressAccount.toJSON();
  }

  async retrieveAcc(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { loginId, deletedStatus: false },
    });

    const connectExpressAccount: any = await stripe.accounts.retrieve(realtor.connectedAccountId);

    return connectExpressAccount.toJSON();
  }

  async updateAcc(loginId: string, data: any): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { loginId, deletedStatus: false },
    });

    const connectExpressAccount: any = await stripe.accounts.update(realtor.connectedAccountId, data);

    return connectExpressAccount.toJSON();
  }

  async deleteAcc(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { loginId, deletedStatus: false },
    });

    // Delete account
    const deletedAccount = await stripe.accounts.del(realtor.connectedAccountId);

  }

  async generateAccLink(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { loginId, deletedStatus: false },
    });

    const accountLink = await stripe.accountLinks.create({
      account: realtor.connectedAccountId,
      refresh_url: `https://dashboard.stripe.com/${realtor.connectedAccountId}/test/dashboard`,
      return_url: `http://localhost:3000/dashboard/${realtor.connectedAccountId}`,
      type: 'account_onboarding',
    });

    console.log('Account link generated:', accountLink);

    return accountLink.url;
  }

  async prosPayment(loginId: string, data: any): Promise<any> {

    let id = data.connectedAccountId;

    const realtor: any = await Realtor.findOne({
      where: { id, deletedStatus: false },
    });

    // Create a PaymentIntent to handle the payment
    const paymentIntent: any = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      payment_method: data.payment_method, // source // Payment method ID or token from the client
      confirm: true,
      transfer_data: {
        destination: realtor.connectedAccountId,
      },
      return_url: data.return_url,
    });
    // Check if the payment is successful
    if (paymentIntent.status === 'succeeded') {
      return paymentIntent.toJSON();
    };
  }

  async dash(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { loginId, deletedStatus: false },
    });

    // Generate a unique login link for the associated Stripe account to access their Express dashboard
    let loginLink = await stripe.accounts.createLoginLink(
      realtor.connectedAccountId,
      // {
      //     redirect_url: "https://dashboard.stripe.com/test/"
      // }
    );

    loginLink.url = loginLink.url + '#/account';
    // Retrieve the URL from the response and redirect the user to Stripe
    return { url: loginLink.url };
  }

  async cBalance(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { loginId, deletedStatus: false },
    });

    const balance: any = await stripe.balance.retrieve({
      stripeAccount: realtor.connectedAccountId,
    });
    return balance.toJSON();
  }

  async trans(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { loginId, deletedStatus: false },
    });

    // Retrieve transactions using the Stripe API
    const transactions: any = await stripe.balanceTransactions.list({
      source: realtor.connectedAccountId, // Use 'destination' instead of 'account'
    });
    return transactions.toJSON();
  }

}
