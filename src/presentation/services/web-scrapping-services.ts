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
        const first_Name: string = req.query.firstName as string || '';
        const last_Name: string = req.query.lastName as string || '';
         const reco_Number: number = parseInt(req.query.recoNumber as string || '0', 10);
         // Check if lastName and recoNumber are provided
    if (!last_Name || isNaN(reco_Number)) {
      const error = new ErrorClass(400,"lastName and recoNumber are required",
      '');
        this.sendErrorResponse(res, error, 400);
      // this.sendErrorResponse(res, "lastName and recoNumber are required", 400);
      return;
  }
         
        const scrapperData=new ScrapperModel(
              first_Name,
              last_Name,
              reco_Number
        )
      // const scrapperData: ScrapperModel =req.body;
  
      const newScrapperData: Either<ErrorClass, ScrapperEntity> =
        await this.getScrapperUsecase.execute(scrapperData);
  
        newScrapperData.cata(
        (error: ErrorClass) => this.sendErrorResponse(res, error, 400),
        (result: ScrapperEntity) => {
          // const resData = SupportMapper.toEntity(result, true);
          this.sendSuccessResponse(res, result, "User verified Successfully", 201);
        }
      );
    }
      }
