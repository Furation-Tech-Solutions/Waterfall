// Define the FQA model for incoming API requests
export class FQAModel {
  constructor(
    public question: string = "",
    public answer: string = ""
  ) {}
}

// Define the FQA entity for data storage and API responses
export class FQAEntity {
  constructor(
    public id: number| undefined = undefined, // Set a default value for id
    public question: string,
    public answer: string
  ) {}
}

// Create a mapper class for converting between data formats
export class FQAMapper {
  static toEntity(
    fqaData: any,
    includeId?: boolean,
    existingFQA?: FQAEntity
  ): FQAEntity {
    if (existingFQA != null) {
      // If existingFQA is provided, merge the data from fqaData with the existingFQA
      return {
        ...existingFQA,
        question:
          fqaData.question !== undefined
            ? fqaData.question
            : existingFQA.question,
        answer:
          fqaData.answer !== undefined
            ? fqaData.answer
            : existingFQA.answer
      };
    } else {
      // If existingFQA is not provided, create a new FQAEntity using fqaData
      const fqaEntity: FQAEntity = {
        id: includeId ? (fqaData.id ? fqaData.id : undefined) : fqaData.id,
        question: fqaData.question,
        answer: fqaData.answer
      };
      return fqaData;
    }
  }

  static toModel(fqa: FQAEntity): any {
    return {
      question: fqa.question,
      answer: fqa.answer
    };
  }
}
