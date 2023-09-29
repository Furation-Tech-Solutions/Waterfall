import { NextFunction, Request, Response } from "express";
import {
  FAQSModel,
  FAQSEntity,
  FAQSMapper,
} from "@domain/faqs/entities/faqs";
import { CreateFAQSUsecase } from "@domain/faqs/usecases/create-faqs";
import { GetAllFAQSsUsecase } from "@domain/faqs/usecases/get-all-faqs";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FAQSService {
  private readonly CreateFAQSUsecase: CreateFAQSUsecase;
  private readonly GetAllFAQSsUsecase: GetAllFAQSsUsecase;

  constructor(
    CreateFAQSUsecase: CreateFAQSUsecase,
    GetAllFAQSsUsecase: GetAllFAQSsUsecase,
  ) {
    this.CreateFAQSUsecase = CreateFAQSUsecase;
    this.GetAllFAQSsUsecase = GetAllFAQSsUsecase;
  }

  async createFAQS(req: Request, res: Response): Promise<void> {
      // Extract FAQS data from the request body and convert it to FAQSModel
      const faqsData: FAQSModel = FAQSMapper.toModel(req.body);

      // Call the CreateFAQSUsecase to create the faqs
      const newFAQS: Either<ErrorClass, FAQSEntity> = await this.CreateFAQSUsecase.execute(
        faqsData
      );

      newFAQS.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: FAQSEntity) =>{
          const responseData = FAQSMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async getAllFAQSs(req: Request, res: Response, next: NextFunction): Promise<void> {
      // Call the GetAllFAQSsUsecase to get all FAQSs
      const faqss: Either<ErrorClass, FAQSEntity[]> = await this.GetAllFAQSsUsecase.execute();
      
      faqss.cata(
        (error: ErrorClass) => res.status(error.status).json({ error: error.message }),
        (result: FAQSEntity[]) => {
            // Filter out faqss with del_status set to "Deleted"
            const nonDeletedFAQSs = result.filter((faqs) => faqs.deleteStatus !== false);

            // Convert non-deleted faqss from an array of FAQSEntity to an array of plain JSON objects using FoodCategoryMapper
            const responseData = nonDeletedFAQSs.map((faqs) => FAQSMapper.toEntity(faqs));
            return res.json(responseData);
        }
    );
  }
}
