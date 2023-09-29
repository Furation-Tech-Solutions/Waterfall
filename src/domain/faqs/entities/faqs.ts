// Express API request populate the FAQS Model
export class FAQSModel {
    constructor(
      public question: string = "",
      public answer: string = "",
      public createdDate: Date,
      public deleteStatus: boolean
    ) {}
  }
  
  // FAQS Entity provided by FAQS Repository is converted to Express API Response
  export class FAQSEntity {
    constructor(
      public id: string | undefined = undefined, // Set a default value for id
      public question: string,
      public answer: string,
      public createdDate: Date,
      public deleteStatus: boolean
    ) {}
  }

  export class FAQSMapper {
    static toEntity(
      faqsData: any,
      includeId?: boolean,
      existingFAQS?: FAQSEntity
    ): FAQSEntity {
      if (existingFAQS != null) {
        // If existingFAQS is provided, merge the data from faqsData with the existingFAQS
        return {
          ...existingFAQS,
          question:
            faqsData.question !== undefined 
            ? faqsData.question 
            : existingFAQS.question,
          answer:
            faqsData.answer !== undefined 
            ? faqsData.answer 
            : existingFAQS.answer,
          createdDate:
            faqsData.createdDate !== undefined 
            ? faqsData.createdDate 
            : existingFAQS.createdDate,
          deleteStatus:
            faqsData.deleteStatus !== undefined
              ? faqsData.deleteStatus
              : existingFAQS.deleteStatus,
        };
      } else {
        // If existingFAQS is not provided, create a new FAQSEntity using faqsData
        const faqsEntity: FAQSEntity = {
          id: includeId ? (faqsData._id ? faqsData._id.toString() : undefined) : faqsData._id.toString(),
          question: faqsData.question,
          answer: faqsData.answer,
          createdDate: faqsData.createdDate,
          deleteStatus: faqsData.deleteStatus
        };
        return faqsEntity;
      }
    }
  
    static toModel(faqs: FAQSEntity): any {
      return {
        id: faqs.id,
        question: faqs.question,
        answer: faqs.answer,
        createdDate: faqs.createdDate,
        deleteStatus: faqs.deleteStatus
      };
    }
  }
  