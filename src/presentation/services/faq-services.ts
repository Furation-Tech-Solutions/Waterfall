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

  // Helper method to send success response
  private sendSuccessResponse(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Helper method to send error response
  private sendErrorResponse(
    res: Response,
    error: ErrorClass,
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Handler for creating a new FAQ
  async createFAQ(req: Request, res: Response): Promise<void> {
    const faqData: FAQModel = FAQMapper.toModel(req.body);

    const newFAQ: Either<ErrorClass, FAQEntity> =
      await this.CreateFAQUsecase.execute(faqData);

    newFAQ.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Bad Request
      (result: FAQEntity) => {
        const resData = FAQMapper.toEntity(result, true);
        this.sendSuccessResponse(res, resData, "FAQ created successfully", 201); // Created
      }
    );
  }

  // Handler for getting all FAQs
  async getAllFAQs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const faqs: Either<ErrorClass, FAQEntity[]> =
      await this.GetAllFAQsUsecase.execute();

    faqs.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, error.status), // Internal Server Error
      (result: FAQEntity[]) => {
        if (result.length === 0) {
          this.sendSuccessResponse(res, [], "Success", 200);
        } else {
          const responseData = result.map((faq) => FAQMapper.toEntity(faq));
          this.sendSuccessResponse(
            res,
            responseData,
            "FAQs retrieved successfully"
          );
        }
      }
    );
  }

  // Handler for getting FAQ by ID
  async getFAQById(req: Request, res: Response): Promise<void> {
    const faqId: string = req.params.id;

    const faq: Either<ErrorClass, FAQEntity> =
      await this.GetFAQByIdUsecase.execute(faqId);

    faq.cata(
      (error: ErrorClass) =>{
        if (error.message === 'not found') {
          // Send success response with status code 200
          this.sendSuccessResponse(res, [], "FAQ not found", 200);
        } else {
          this.sendErrorResponse(res, error, 404);
        }
      },
      (result: FAQEntity) => {

          const resData = FAQMapper.toEntity(result);
          this.sendSuccessResponse(
            res,
            resData,
            "FAQ retrieved successfully"
          );
        
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
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      async (existingFAQData: FAQEntity) => {
        const resData = FAQMapper.toEntity(existingFAQData, true);

        const updatedFAQEntity: FAQEntity = FAQMapper.toEntity(
          faqData,
          true,
          resData
        );

        const updatedFAQ: Either<ErrorClass, FAQEntity> =
          await this.UpdateFAQUsecase.execute(faqId, updatedFAQEntity);

        updatedFAQ.cata(
          (error: ErrorClass) => this.sendErrorResponse(res, error, 500), // Internal Server Error
          (result: FAQEntity) => {
            const resData = FAQMapper.toEntity(result, true);
            this.sendSuccessResponse(
              res,
              resData,
              "FAQ updated successfully"
            );
          }
        );
      }
    );
  }

  // Handler for deleting FAQ by ID
  async deleteFAQ(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    const deleteFAQ: Either<ErrorClass, void> =
      await this.DeleteFAQUsecase.execute(id);

    deleteFAQ.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404), // Not Found
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "FAQ deleted successfully",
          204
        ); // No Content
      }
    );
  }
}
