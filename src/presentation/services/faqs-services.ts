import { NextFunction, Request, Response } from "express";
import {
  FAQSModel,
  FAQSEntity,
  FAQSMapper,
} from "@domain/faqs/entities/faqs";
import { CreateFAQSUsecase } from "@domain/faqs/usecases/create-faqs";
import { GetAllFAQSsUsecase } from "@domain/faqs/usecases/get-all-faqs";
import { GetFAQSByIdUsecase } from "@domain/faqs/usecases/get-faqs-by-id";
import { UpdateFAQSUsecase } from "@domain/faqs/usecases/update-faqs";
import ApiError from "@presentation/error-handling/api-error";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FAQSService {
  private readonly CreateFAQSUsecase: CreateFAQSUsecase;
  private readonly GetAllFAQSsUsecase: GetAllFAQSsUsecase;
  private readonly GetFAQSByIdUsecase: GetFAQSByIdUsecase;
  private readonly UpdateFAQSUsecase: UpdateFAQSUsecase;

  constructor(
    CreateFAQSUsecase: CreateFAQSUsecase,
    GetAllFAQSsUsecase: GetAllFAQSsUsecase,
    GetFAQSByIdUsecase: GetFAQSByIdUsecase,
    UpdateFAQSUsecase: UpdateFAQSUsecase,
  ) {
    this.CreateFAQSUsecase = CreateFAQSUsecase;
    this.GetAllFAQSsUsecase = GetAllFAQSsUsecase;
    this.GetFAQSByIdUsecase = GetFAQSByIdUsecase;
    this.UpdateFAQSUsecase = UpdateFAQSUsecase;
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

  async getFAQSById(req: Request, res: Response): Promise<void> {
      const id: string = req.params.id;

      // Call the GetFAQSByIdUsecase to get the faqs by ID
      const faqs: Either<ErrorClass, FAQSEntity | null> = await this.GetFAQSByIdUsecase.execute(
        id
      );

      faqs.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: FAQSEntity | null) =>{
          const responseData = FAQSMapper.toEntity(result, true);
          return res.json(responseData)
        }
      )
  }

  async updateFAQS(req: Request, res: Response): Promise<void> {
      const id: string = req.params.id;
      const faqsData: FAQSModel = req.body;

      // Get the existing faqs by ID
      const existingFAQS: Either<ErrorClass, FAQSEntity | null> =
        await this.GetFAQSByIdUsecase.execute(id);

      if (!existingFAQS) {
        // If faqs is not found, send a not found message as a JSON response
        ApiError.notFound();
        return;
      }

      // Convert faqsData from FAQSModel to FAQSEntity using FAQSMapper
      const updatedFAQSEntity: FAQSEntity = FAQSMapper.toEntity(
        faqsData,
        true
      );

      // Call the UpdateFAQSUsecase to update the FAQS
      const updatedFAQS: Either<ErrorClass, FAQSEntity> = await this.UpdateFAQSUsecase.execute(
        id,
        updatedFAQSEntity
      );

      updatedFAQS.cata(
        (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
        (result: FAQSEntity) =>{
          const responseData = FAQSMapper.toModel(result);
          return res.json(responseData)
        }
      )
  }
}
