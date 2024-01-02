// Express API request DTO (Data Transfer Object) for Job Applicants
export class PaymentGatewayModel {
  constructor(
    public jobId: number = 0, // ID of the job associated with the payment, default is 0
    public toRealtorId: string = "", // ID of the job applicant, default is 0
    public amount: string = "", // Payment amount, default is an empty string
    public currency: string = "", // Payment amount, default is an empty string
    public fromRealtorId: string = "", // Payment method, default is 'Paypal'
    public transactionId: string = "", // Payment method, default is an empty string
    public status: string = "Pending", // Payment method, default is an empty string
    public fromRealtorData: {} = {},
    public toRealtorData: {} = {}
  ) { }
}

// PaymentGateway Entity provided by PaymentGateway Repository is converted to Express API Response
export class PaymentGatewayEntity {
  constructor(
    public id: number | undefined = undefined, // Unique identifier for the payment, initially undefined
    public jobId: number, // ID of the job associated with the payment
    public toRealtorId: string, // ID of the job applicant
    public amount: string, // Payment amount
    public currency: string, // Payment amount
    public fromRealtorId: string, // Payment method
    public transactionId: string, // Payment method
    public status: string, // Payment method
    public fromRealtorData: {},
    public toRealtorData: {}
  ) { }
}

// Mapper class to convert between DTO, Entity, and API response formats
export class PaymentGatewayMapper {
  // Static method to convert DTO or API request data to an Entity
  static toEntity(
    paymentGatewayData: any, // Input data for the payment
    includeId?: boolean, // Optional flag to include an ID
    existingPaymentGateway?: PaymentGatewayEntity // Optional existing PaymentGatewayEntity to merge with
  ): PaymentGatewayEntity {
    if (existingPaymentGateway != null) {
      // If existingPaymentGateway is provided, merge the data from paymentGatewayData with the existingPaymentGateway
      return {
        ...existingPaymentGateway,
        jobId:
          paymentGatewayData.jobId !== undefined
            ? paymentGatewayData.jobId
            : existingPaymentGateway.jobId, // Use existing job ID if not provided in paymentGatewayData
        toRealtorId:
          paymentGatewayData.toRealtorId !== undefined
            ? paymentGatewayData.toRealtorId
            : existingPaymentGateway.toRealtorId, // Use existing toRealtorId if not provided in paymentGatewayData
        amount:
          paymentGatewayData.amount !== undefined
            ? paymentGatewayData.amount
            : existingPaymentGateway.amount, // Use existing amount if not provided in paymentGatewayData
        currency:
          paymentGatewayData.currency !== undefined
            ? paymentGatewayData.currency
            : existingPaymentGateway.currency, // Use existing currency if not provided in paymentGatewayData
        fromRealtorId:
          paymentGatewayData.fromRealtorId !== undefined
            ? paymentGatewayData.fromRealtorId
            : existingPaymentGateway.fromRealtorId, // Use existing fromRealtorId if not provided in paymentGatewayData
        transactionId:
          paymentGatewayData.transactionId !== undefined
            ? paymentGatewayData.transactionId
            : existingPaymentGateway.transactionId, // Use existing transactionId if not provided in paymentGatewayData
        status:
          paymentGatewayData.status !== undefined
            ? paymentGatewayData.status
            : existingPaymentGateway.status, // Use existing status if not provided in paymentGatewayData

      };
    } else {
      // If existingPaymentGateway is not provided, create a new PaymentGatewayEntity using paymentGatewayData
      const paymentGatewayEntity: PaymentGatewayEntity = {
        id: includeId
          ? paymentGatewayData.id
            ? paymentGatewayData.id
            : undefined
          : paymentGatewayData.id.toString(), // Set the ID if includeId is true
        jobId: paymentGatewayData.job,
        toRealtorId: paymentGatewayData.toRealtorId,
        amount: paymentGatewayData.amount,
        currency: paymentGatewayData.currency,
        fromRealtorId: paymentGatewayData.fromRealtorId,
        transactionId: paymentGatewayData.transactionId,
        status: paymentGatewayData.status,
        fromRealtorData: paymentGatewayData.fromRealtorData,
        toRealtorData: paymentGatewayData.toRealtorData,

      };
      return paymentGatewayEntity;
    }
  }

  // Static method to convert an Entity to a DTO or API response format
  static toModel(paymentGateway: PaymentGatewayEntity): any {
    return {
      id: paymentGateway.id, // Extract and include the ID
      jobId: paymentGateway.jobId, // Extract and include the job ID
      toRealtorId: paymentGateway.toRealtorId, // Extract and include the toRealtorId
      amount: paymentGateway.amount, // Extract and include the amount
      currency: paymentGateway.currency, // Extract and include the currency
      fromRealtorId: paymentGateway.fromRealtorId, // Extract and include the fromRealtorId
      transactionId: paymentGateway.transactionId, // Extract and include the transactionId
      status: paymentGateway.status, // Extract and include the status
      fromRealtorData: paymentGateway.fromRealtorData,
      toRealtorData: paymentGateway.toRealtorData,

    };
  }
}
