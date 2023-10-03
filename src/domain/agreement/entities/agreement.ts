// Express API request DTO for Agreement
export class AgreementModel {
  constructor(
    public jobApplicant: string = "",
    public Agree: boolean = false,
    public status: string = "Pending",
    public agreementTimestamp: Date = new Date()
  ) {}
}

// Agreement Entity provided by Agreement Repository is converted to Express API Response
export class AgreementEntity {
  constructor(
    public id: string | undefined = undefined,
    public jobApplicant: string,
    public Agree: boolean,
    public status: string,
    public agreementTimestamp: Date
  ) {}
}

export class AgreementMapper {
  static toEntity(
    agreementData: any,
    includeId?: boolean,
    existingAgreement?: AgreementEntity
  ): AgreementEntity {
    if (existingAgreement != null) {
      // If existingAgreement is provided, merge the data from agreementData with the existingAgreement
      return {
        ...existingAgreement,
        jobApplicant:
          agreementData.jobApplicant !== undefined
            ? agreementData.jobApplicant
            : existingAgreement.jobApplicant,
        Agree:
          agreementData.Agree !== undefined
            ? agreementData.Agree
            : existingAgreement.Agree,
        status:
          agreementData.status !== undefined
            ? agreementData.status
            : existingAgreement.status,
        agreementTimestamp:
          agreementData.agreementTimestamp !== undefined
            ? agreementData.agreementTimestamp
            : existingAgreement.agreementTimestamp,
      };
    } else {
      // If existingAgreement is not provided, create a new AgreementEntity using agreementData
      const agreementEntity: AgreementEntity = {
        id: includeId
          ? agreementData.id
            ? agreementData.id.toString()
            : undefined
          : agreementData.id,
        jobApplicant: agreementData.jobApplicant,
        Agree: agreementData.Agree,
        status: agreementData.status,
        agreementTimestamp: agreementData.agreementTimestamp,
      };
      return agreementEntity;
    }
  }

  static toModel(agreement: AgreementEntity): any {
    return {
      id: agreement.id,
      jobApplicant: agreement.jobApplicant,
      Agree: agreement.Agree,
      status: agreement.status,
      agreementTimestamp: agreement.agreementTimestamp,
    };
  }
}
