// Define the FAQ model for incoming API requests
export class FAQModel {
  constructor(
    public question: string = "",
    public answer: string = ""
  ) {}
}

// Define the FAQ entity for data storage and API responses
export class FAQEntity {
  constructor(
    public id: number| undefined = undefined, // Set a default value for id
    public question: string,
    public answer: string
  ) {}
}

// Create a mapper class for converting between data formats
export class FAQMapper {
  static toEntity(
    faqData: any,
    includeId?: boolean,
    existingFAQ?: FAQEntity
  ): FAQEntity {
    if (existingFAQ != null) {
      // If existingFAQ is provided, merge the data from faqData with the existingFAQ
      return {
        ...existingFAQ,
        question:
          faqData.question !== undefined
            ? faqData.question
            : existingFAQ.question,
        answer:
          faqData.answer !== undefined
            ? faqData.answer
            : existingFAQ.answer
      };
    } else {
      // If existingFAQ is not provided, create a new FAQEntity using faqData
      const faqEntity: FAQEntity = {
        id: includeId ? (faqData.id ? faqData.id : undefined) : faqData.id,
        question: faqData.question,
        answer: faqData.answer
      };
      return faqData;
    }
  }

  static toModel(faq: FAQEntity): any {
    return {
      question: faq.question,
      answer: faq.answer
    };
  }
}
