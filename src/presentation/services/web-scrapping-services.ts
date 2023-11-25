import { ScrapperEntity, ScrapperModel } from "@domain/scrapping/entities/scrapper";
import { GetScrapperUsecase } from "@domain/scrapping/usecases/get-scrapper";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Request, Response } from "express";
import {Either} from "monet"


export class WebScrapping{
  private readonly getScrapperUsecase: GetScrapperUsecase;

      constructor(
        getScrapperUsecase: GetScrapperUsecase,
            
      ){
        this.getScrapperUsecase = getScrapperUsecase;
      }


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

      async checkRecoNumber(req:Request,res:Response):Promise<void>{
   
      const scrapperData: ScrapperModel =req.body;
  
      const newScrapperData: Either<ErrorClass, ScrapperEntity> =
        await this.getScrapperUsecase.execute(scrapperData);
  
        newScrapperData.cata(
        (error: ErrorClass) => this.sendErrorResponse(res, error, 400),
        (result: ScrapperEntity) => {
          // const resData = SupportMapper.toEntity(result, true);
          this.sendSuccessResponse(res, result, "Support created successfully", 201);
        }
      );
    }
      }
