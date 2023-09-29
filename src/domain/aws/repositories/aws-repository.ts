import { Either } from "monet";
import  ErrorClass from "@presentation/error-handling/api-error";

export interface MediaRepository {
  getPreSignedUrl(media: string): Promise<Either<ErrorClass, string>>;
  // deleteBrandLogo(): Promise<Either<ErrorClass, string>>;
}