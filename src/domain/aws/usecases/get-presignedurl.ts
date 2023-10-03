import { MediaRepository } from "@data/aws/repositories/aws-repositories-impl";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
export interface GetPreSignedUrlUsecase {
  execute: (media: string) => Promise<Either<ErrorClass, string>>;
}
export class GetPreSignedUrl implements GetPreSignedUrlUsecase {
  private readonly mediaRepo: MediaRepository;

  constructor(mediaRepo: MediaRepository) {
    this.mediaRepo=mediaRepo;
  }

  async execute(media: string): Promise<Either<ErrorClass, string>> {
    // console.log(outletId);
    return await this.mediaRepo.getPresignedUrl(media);
  }
}