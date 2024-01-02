// Import necessary dependencies and modules
import { Op, Sequelize } from "sequelize";
import {
  PaymentGatewayEntity,
  PaymentGatewayModel,
} from "@domain/paymentGateway/entities/paymentGateway"; // Import the PaymentGatewayModel
import Transactions from "@data/paymentGateway/models/paymentGateway-models"; // Import the PaymentGateway model
import Realtors from "@data/realtors/model/realtor-model";
import Job from "@data/job/models/job-model";
import JobApplicant from "@data/jobApplicants/models/jobApplicants-models";
import ApiError from "@presentation/error-handling/api-error";
import Realtor from "@data/realtors/model/realtor-model";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51OL6H0IZoxttFA7OkUh1eTIgn2aX2GDIw3GPrUk37pQOHzCgyRpgb691kMcBiy90qkbdxbaTP7kmERH9I4iFFzTc00ndt8cjPR');

// Define a Query object to encapsulate parameters
export interface Query {
  id?: string;
  q?: string;
  page?: number;
  limit?: number;
  refresh_url?: string;
  return_url?: string;
  sortOrder?: "ASC" | "DESC";
}
// Create PaymentGatewayDataSource Interface
export interface PaymentGatewayDataSource {
  // Define methods for data operations on PaymentGateway entities
  create(paymentGateway: any): Promise<PaymentGatewayEntity>;
  update(id: string, paymentGateway: any): Promise<PaymentGatewayEntity>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<PaymentGatewayEntity | null>;
  getAll(id: string): Promise<PaymentGatewayEntity[]>;
  createAccount(loginId: string, data: any): Promise<any>;
  retrieveAcc(loginId: string): Promise<any>;
  updateAcc(loginId: string, data: any): Promise<any>;
  deleteAcc(loginId: string): Promise<any>;
  generateAccLink(loginId: string, query: Query): Promise<any>;
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
    const createdPaymentGateway = await Transactions.create(paymentGateway);

    // Return the newly created PaymentGatewayEntity as a plain JavaScript object
    return createdPaymentGateway.toJSON();
  }

  // Implement the "delete" method to remove a PaymentGatewayEntity by ID
  async delete(id: string): Promise<void> {
    // Delete a PaymentGatewayEntity record from the database based on its ID
    await Transactions.destroy({
      where: {
        id: id,
      },
    });
  }

  // Implement the "read" method to retrieve a PaymentGatewayEntity by ID
  async read(id: string): Promise<PaymentGatewayEntity | null> {
    // Find a PaymentGatewayEntity record in the database by its ID
    const paymentGateway = await Transactions.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Realtors,
          foreignKey: "toRealtorId",
          as: "toRealtorData",
        },
        {
          model: Realtors,
          foreignKey: "fromRealtorId",
          as: "fromRealtorData",
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
  async getAll(id: string): Promise<PaymentGatewayEntity[]> {
    // Retrieve all PaymentGatewayEntity records from the database
    const paymentGateway = await Transactions.findAll({
      where: {
        [Op.or]: [
          {
            fromRealtorId: id,
          },
          {
            toRealtorId: id,
          },
        ],
      },
      include: [
        {
          model: Realtors,
          foreignKey: "toRealtorId",
          as: "toRealtorData",
        },
        {
          model: Realtors,
          foreignKey: "fromRealtorId",
          as: "fromRealtorData",
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
    const paymentGateway = await Transactions.findByPk(id);

    // Update the PaymentGatewayEntity record with the provided data
    if (paymentGateway) {
      await paymentGateway.update(updatedData);
    }

    // Fetch the updated PaymentGatewayEntity record
    const updatedPaymentGateway = await Transactions.findByPk(id);

    if (updatedPaymentGateway == null) {
      throw ApiError.notFound();
    }
    return updatedPaymentGateway.toJSON();
  }

  // Define a method to create a Connect Express account
  async createAccount(loginId: string, data: any): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });

    // Update the record with the provided data if it exists
    if (realtor.connectedAccountId !== "") {
      throw ApiError.accountExist();
    }


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

    // Update the record with the provided data if it exists
    if (realtor) {
      await realtor.update({ connectedAccountId: connectExpressAccount.id });
    }

    if (!connectExpressAccount.id) {
      throw new Error('Failed to create Connect Express account');
    };

    return {
      "id": connectExpressAccount.id,
      "realtor": realtor
    };
  }

  async retrieveAcc(loginId: string): Promise<any> {
    // console.log(loginId);
    const realtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });
    if (realtor.connectedAccountId === "") {
      throw ApiError.dataNotFound();
    }
    const connectExpressAccount: any = await stripe.accounts.retrieve(realtor.connectedAccountId);

    // console.log(connectExpressAccount, "connectExpressAccount");
    return connectExpressAccount;
  }

  async updateAcc(loginId: string, data: any): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });

    const connectExpressAccount: any = await stripe.accounts.update(realtor.connectedAccountId, data);

    return connectExpressAccount;
  }

  async deleteAcc(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });

    // Delete account
    const deletedAccount = await stripe.accounts.del(realtor.connectedAccountId);

    await realtor.update({ connectedAccountId: "" });

  }

  async generateAccLink(loginId: string, query: Query): Promise<any> {
    // console.log(query);

    let ref_url: string = "https://www.google.com/search?q=refresh+url"
    let rtn_url: string = "https://www.google.com/search?q=return+url"
    if (query != undefined) {
      if (query.refresh_url != undefined) {

        ref_url = query.refresh_url
      }
      if (query.return_url != undefined) {
        rtn_url = query.return_url
      }
    }
    // console.log(query);
    const realtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });

    const accountLink = await stripe.accountLinks.create({
      account: realtor.connectedAccountId,
      refresh_url: ref_url,
      return_url: rtn_url,
      type: 'account_onboarding',
    });

    // console.log('Account link generated:', accountLink);

    return accountLink.url;
  }

  async prosPayment(loginId: string, data: any): Promise<any> {
    // console.log(data, "ds");

    const fromRealtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });

    const toRealtor: any = await Realtor.findOne({
      where: { id: data.toRealtorId, deletedStatus: false },
    });

    const createdPayment: any = await Transactions.create({
      toRealtorId: data.toRealtorId,
      fromRealtorId: loginId,
      jobId: data.jobId,
      amount: data.amount,
      currency: data.currency
    });
    // console.log(createdPayment);

    // Create a PaymentIntent to handle the payment
    const paymentIntent: any = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      payment_method: data.payment_method, // source // Payment method ID or token from the client
      description: data.description,
      confirm: true,
      transfer_data: {
        destination: toRealtor.connectedAccountId,
      },
      metadata: data.metadata,
      return_url: data.return_url || "https://www.google.com/search?q=return+url",
    });

    // Check if the payment is successful
    if (paymentIntent) {
      // console.log(toRealtor);
      let trans: any = createdPayment.update({
        transactionId: paymentIntent.id,
        status: paymentIntent.status
      });


      return trans;

    };

  }

  async dash(loginId: string): Promise<any> {

    const realtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
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
      where: { id: loginId, deletedStatus: false },
    });

    const balance: any = await stripe.balance.retrieve({
      stripeAccount: realtor.connectedAccountId,
    });
    return balance;
  }

  async trans(loginId: string): Promise<any> {

    interface TransactionData {
      id: string;
      amount: number;
      currency: string;
      description: string;
    }

    const realtor: any = await Realtor.findOne({
      where: { id: loginId, deletedStatus: false },
    });

    // Retrieve transactions using the Stripe API
    const transactions: any = await stripe.balanceTransactions.list({
      stripeAccount: realtor.connectedAccountId, // Use 'destination' instead of 'account'
    });
    console.log(transactions);
    // Store transactions in an array
    const transactionDataArray: TransactionData[] = transactions.data.map(
      (transaction: Stripe.BalanceTransaction) => ({
        id: transaction.id,
        amount: transaction.amount / 100,
        currency: transaction.currency,
        description: transaction.description || '',
      })
    );

    return transactionDataArray;
  }

}
