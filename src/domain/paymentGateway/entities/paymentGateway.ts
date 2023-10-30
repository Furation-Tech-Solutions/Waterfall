// Express API request DTO (Data Transfer Object) for Job Applicants
export class PaymentGatewayModel {
  constructor(
    public jobId: number = 0,
    public jobApplicantId: number = 0,
    public amount: string = "",
    public paymentMethod: string = "Paypal"
  ) {}
}

// PaymentGateway Entity provided by PaymentGateway Repository is converted to Express API Response
export class PaymentGatewayEntity {
  constructor(
    public id: number | undefined = undefined,
    public jobId: number,
    public jobApplicantId: number,
    public amount: string,
    public paymentMethod: string
  ) {}
}

// Mapper class to convert between DTO, Entity, and API response formats
export class PaymentGatewayMapper {
  // Static method to convert DTO or API request data to an Entity
  static toEntity(
    paymentGatewayData: any,
    includeId?: boolean,
    existingPaymentGateway?: PaymentGatewayEntity
  ): PaymentGatewayEntity {
    if (existingPaymentGateway != null) {
      // If existingPaymentGateway is provided, merge the data from jobApplicantData with the existingJobApplicant
      return {
        ...existingPaymentGateway,
        jobId:
          paymentGatewayData.jobId !== undefined
            ? paymentGatewayData.jobId
            : existingPaymentGateway.jobId,
        jobApplicantId:
          paymentGatewayData.jobApplicantId !== undefined
            ? paymentGatewayData.jobApplicantId
            : existingPaymentGateway.jobApplicantId,
        amount:
          paymentGatewayData.amount !== undefined
            ? paymentGatewayData.amount
            : existingPaymentGateway.amount,
        paymentMethod:
          paymentGatewayData.paymentMethod !== undefined
            ? paymentGatewayData.paymentMethod
            : existingPaymentGateway.paymentMethod,
      };
    } else {
      // If existingpaymentGateway is not provided, create a new JobApplicantEntity using jobApplicantData
      const paymentGatewayEntity: PaymentGatewayEntity = {
        id: includeId
          ? paymentGatewayData.id
            ? paymentGatewayData.id.toString()
            : undefined
          : paymentGatewayData.id.toString(),
        jobId: paymentGatewayData.job,
        jobApplicantId: paymentGatewayData.jobApplicantId,
        amount: paymentGatewayData.amount,
        paymentMethod: paymentGatewayData.paymentMethod,
      };
      return paymentGatewayData;
    }
  }

  // Static method to convert an Entity to a DTO or API response format
  static toModel(paymentGateway: PaymentGatewayEntity): any {
    return {
      id: paymentGateway.id,
      jobId: paymentGateway.jobId,
      jobApplicantId: paymentGateway.jobApplicantId,
      amount: paymentGateway.amount,
      paymentMethod: paymentGateway.paymentMethod,
    };
  }
}
