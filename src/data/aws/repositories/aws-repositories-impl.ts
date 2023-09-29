import { Either, Left, Right } from "monet";
import { MediaDataSource } from "../datasources/aws-data-source";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
// import { MediaRepository } from "@domain/aws/respository/mediaRepository";

// Define the OutletMediaRepository interface
export interface MediaRepository {
  getPresignedUrl(media: string): Promise<Either<ErrorClass, string>>;
  // DeleteBrandLogo(): Promise<Either<ErrorClass, string>>;
}

// Implement the MediaRepository
export class MediaRepositoryImpl implements MediaRepository {
  constructor(private readonly mediaDataSource: MediaDataSource) {}

  async getPresignedUrl(media: string): Promise<Either<ErrorClass, string>>{
    // Call the MediaDataSource to get the signed URL
    try {
      const signedUrl = await this.mediaDataSource.getPresignedUrl(media);
      return Right<ErrorClass, string>(signedUrl);
    } catch (error) {
      return Left<ErrorClass, string>(ApiError.badRequest());
    }
  }

  // async DeleteBrandLogo(): Promise<Either<ErrorClass, string>> {
  //   try {

  //     // Call the MediaDataSource to delete the brand logo
  //     const BrandLogo = await this.mediaDataSource.deleteBrandLogo();
  //     return Right<ErrorClass, string>(BrandLogo);
  //   } catch (error) {
  //       return Left<ErrorClass, string>(ApiError.badRequest());
  //   }
  // }
}