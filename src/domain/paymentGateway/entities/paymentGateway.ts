// Express API request DTO (Data Transfer Object) for Job Applicants
export class PaymentGatewayModel {
  constructor(
    public jobId: number = 0, // ID of the job associated with the payment, default is 0
    public jobApplicantId: number = 0, // ID of the job applicant, default is 0
    public amount: string = "", // Payment amount, default is an empty string
    public paymentMethod: string = "Paypal" // Payment method, default is 'Paypal'
  ) { }
}

// PaymentGateway Entity provided by PaymentGateway Repository is converted to Express API Response
export class PaymentGatewayEntity {
  constructor(
    public id: number | undefined = undefined, // Unique identifier for the payment, initially undefined
    public jobId: number, // ID of the job associated with the payment
    public jobApplicantId: number, // ID of the job applicant
    public amount: string, // Payment amount
    public paymentMethod: string // Payment method
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
        jobApplicantId:
          paymentGatewayData.jobApplicantId !== undefined
            ? paymentGatewayData.jobApplicantId
            : existingPaymentGateway.jobApplicantId, // Use existing job applicant ID if not provided in paymentGatewayData
        amount:
          paymentGatewayData.amount !== undefined
            ? paymentGatewayData.amount
            : existingPaymentGateway.amount, // Use existing amount if not provided in paymentGatewayData
        paymentMethod:
          paymentGatewayData.paymentMethod !== undefined
            ? paymentGatewayData.paymentMethod
            : existingPaymentGateway.paymentMethod, // Use existing payment method if not provided in paymentGatewayData
      };
    } else {
      // If existingPaymentGateway is not provided, create a new PaymentGatewayEntity using paymentGatewayData
      const paymentGatewayEntity: PaymentGatewayEntity = {
        id: includeId
          ? paymentGatewayData.id
            ? paymentGatewayData.id.toString()
            : undefined
          : paymentGatewayData.id.toString(), // Set the ID if includeId is true
        jobId: paymentGatewayData.job,
        jobApplicantId: paymentGatewayData.jobApplicantId,
        amount: paymentGatewayData.amount,
        paymentMethod: paymentGatewayData.paymentMethod,
      };
      return paymentGatewayEntity;
    }
  }

  // Static method to convert an Entity to a DTO or API response format
  static toModel(paymentGateway: PaymentGatewayEntity): any {
    return {
      id: paymentGateway.id, // Extract and include the ID
      jobId: paymentGateway.jobId, // Extract and include the job ID
      jobApplicantId: paymentGateway.jobApplicantId, // Extract and include the job applicant ID
      amount: paymentGateway.amount, // Extract and include the amount
      paymentMethod: paymentGateway.paymentMethod, // Extract and include the payment method
    };
  }
}
