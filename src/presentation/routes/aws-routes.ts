import { Router } from "express"; // Correctly import Request and Response

import { MediaDataSourceImpl } from "@data/aws/datasources/aws-data-source";
import { MediaRepositoryImpl } from "@data/aws/repositories/aws-repositories-impl";
import { GetPreSignedUrl } from "@domain/aws/usecases/get-presignedurl";
import { MediaService } from "@presentation/services/aws-services";
import mongoose from "mongoose";
// import { DeleteBrandLogo } from "@domain/aws/usecases/delete-media";

// Create an instance of the DataSourceImpl
const DataSource = new MediaDataSourceImpl();
// Create an instance of the RepositoryImpl and pass the DataSourceImpl
const MediaRepository = new MediaRepositoryImpl(DataSource);

// Create instances of the required use cases and pass the MediaRepositoryImpl
const MediaUsecase = new GetPreSignedUrl(MediaRepository);
// const deleteBrandLogoUsecase = new DeleteBrandLogo(MediaRepository);

// Initialize mediaService and inject required dependencies
const mediaService = new MediaService(
  MediaUsecase,
  // deleteBrandLogoUsecase
);

// Create an Express router
export const mediaRouter = Router();


mediaRouter.get(
  "/getpresignedurl/:media",
  mediaService.getPreSignedUrl.bind(mediaService)
);
// mediaRouter.delete(
//   "/deleteMedia/",
//   mediaService.deletePreSignedUrl.bind(MediaService)
// )