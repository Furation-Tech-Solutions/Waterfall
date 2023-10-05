// Express API request populate the FQA Model
export class FQAModel {
    constructor(
      public question: string = "",
      public answer: string = ""
    ) {}
  }
  
  // FQA Entity provided by FQA Repository is converted to Express API Response
  export class FQAEntity {
    constructor(
      public id: string | undefined = undefined, // Set a default value for id
      public question: string,
      public answer: string
    ) {}
  }

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
  