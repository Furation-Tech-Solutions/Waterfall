import { NextFunction, Request, Response } from "express";
import { FAQModel, FAQEntity, FAQMapper } from "@domain/faq/entities/faq";
import { CreateFAQUsecase } from "@domain/faq/usecases/create-faq";
import { GetAllFAQsUsecase } from "@domain/faq/usecases/get-all-faqs";
import { GetFAQByIdUsecase } from "@domain/faq/usecases/get-faq-by-id";
import { UpdateFAQUsecase } from "@domain/faq/usecases/update-faq";
import { DeleteFAQUsecase } from "@domain/faq/usecases/delete-faq";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export class FAQService {
  private readonly CreateFAQUsecase: CreateFAQUsecase;
  private readonly GetAllFAQsUsecase: GetAllFAQsUsecase;
  private readonly GetFAQByIdUsecase: GetFAQByIdUsecase;
  private readonly UpdateFAQUsecase: UpdateFAQUsecase;
  private readonly DeleteFAQUsecase: DeleteFAQUsecase;

  constructor(
    CreateFAQUsecase: CreateFAQUsecase,
    GetAllFAQsUsecase: GetAllFAQsUsecase,
    GetFAQByIdUsecase: GetFAQByIdUsecase,
    UpdateFAQUsecase: UpdateFAQUsecase,
    DeleteFAQUsecase: DeleteFAQUsecase
  ) {
    this.CreateFAQUsecase = CreateFAQUsecase;
    this.GetAllFAQsUsecase = GetAllFAQsUsecase;
    this.GetFAQByIdUsecase = GetFAQByIdUsecase;
    this.UpdateFAQUsecase = UpdateFAQUsecase;
    this.DeleteFAQUsecase = DeleteFAQUsecase;
  }

  // Handler for creating a new FAQ
  async createFAQ(req: Request, res: Response): Promise<void> {
    const faqData: FAQModel = FAQMapper.toModel(req.body);

    const newFAQ: Either<ErrorClass, FAQEntity> =
      await this.CreateFAQUsecase.execute(faqData);

    newFAQ.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: FAQEntity) => {
        const resData = FAQMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Handler for getting all FAQs
  async getAllFAQs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Call the GetAllFAQsUsecase to get all FAQs
    const faqs: Either<ErrorClass, FAQEntity[]> =
      await this.GetAllFAQsUsecase.execute();

    faqs.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: FAQEntity[]) => {
        // Filter out FAQs with del_status set to "Deleted"
        // const nonDeletedFAQs = result.filter((faq) => faq.deleteStatus !== false);

        // Convert non-deleted FAQs from an array of FAQEntity to an array of plain JSON objects using faqMapper
        const responseData = faqs.map((faq) => FAQMapper.toEntity(faq));
        return res.json(responseData);
      }
    );
  }

  // Handler for getting FAQ by ID
  async getFAQById(req: Request, res: Response): Promise<void> {
    const faqId: string = req.params.id;

    const faq: Either<ErrorClass, FAQEntity> =
      await this.GetFAQByIdUsecase.execute(faqId);

    faq.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: FAQEntity) => {
        if (!result) {
          return res.json({ message: "FAQ Name not found." });
        }
        const resData = FAQMapper.toEntity(result);
        return res.json(resData);
      }
    );
  }

  // Handler for updating FAQ by ID
  async updateFAQ(req: Request, res: Response): Promise<void> {
    const faqId: string = req.params.id;
    const faqData: FAQModel = req.body;

    const existingFAQ: Either<ErrorClass, FAQEntity> =
      await this.GetFAQByIdUsecase.execute(faqId);

    existingFAQ.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (existingFAQData: FAQEntity) => {
        const updatedFAQEntity: FAQEntity = FAQMapper.toEntity(
          faqData,
          true,
          existingFAQData
        );

        const updatedFAQ: Either<ErrorClass, FAQEntity> =
          await this.UpdateFAQUsecase.execute(faqId, updatedFAQEntity);

        updatedFAQ.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (result: FAQEntity) => {
            const resData = FAQMapper.toEntity(result, true);
            res.json(resData);
          }
        );
      }
    );
  }

  // Handler for deleting FAQ by ID
  async deleteFAQ(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    // Execute the deleteFAQ use case to delete an FAQ by ID
    const deleteFAQ: Either<ErrorClass, void> =
      await this.DeleteFAQUsecase.execute(id);

    deleteFAQ.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: void) => {
        return res.json({ message: "FAQ deleted successfully." });
      }
    );
  }
}
