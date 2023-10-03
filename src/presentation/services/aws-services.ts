// Import necessary classes, interfaces, and dependencies
import { Request, Response } from "express";

import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { GetPreSignedUrlUsecase } from "@domain/aws/usecases/get-presignedurl";
// import { DeleteBrandLogoUsecase } from "@domain/aws/usecases/delete-media";

export class MediaService {

  private readonly createMediaUsecase: GetPreSignedUrlUsecase;
  //  private readonly deleteBrandLogoUsecase: DeleteBrandLogoUsecase;
  constructor(
    createMediaUsecase: GetPreSignedUrlUsecase,
    // deleteBrandLogoUsecase: DeleteBrandLogoUsecase
  ) {
    this.createMediaUsecase=createMediaUsecase;
    // this.deleteBrandLogoUsecase = deleteBrandLogoUsecase;
  }

  async getPreSignedUrl(  
    req: Request,
    res: Response,
    ){
        
      const media: string = req.params.media;
       console.log("image url",media);
      const presignedurl: Either<ErrorClass, string> =await this.createMediaUsecase.execute(media);
      console.log("presignedurl",presignedurl);
      presignedurl.cata(
        (error: ErrorClass) => {
          console.log(error);
          res.status(error.status).json({ error: error.message });
        },
        async (result: string) => {
          res.status(200).json({ "presignedurl": result});
        }
      )  
  }
  
  // async deletePreSignedUrl(req: Request, res: Response) {

  //   const deletedBrandLogo: Either<ErrorClass, string>=await this.deleteBrandLogoUsecase.execute();
  //   deletedBrandLogo.cata(
  //     (error: ErrorClass) => { 
  //       res.status(error.status).json({error: error.message});
  //     },
  //     async (result: string) => {
  //       res.status(200).json(result);
  //     }
  //   )
  // }
}