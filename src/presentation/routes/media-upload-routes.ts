
import S3MediaUploader from "@presentation/services/s3-aws-services";
import { Router } from "express"; // Correctly import Request and Response

const mediaUploadService=new S3MediaUploader()


// Create an Express router
export const mediaRoutes = Router();


mediaRoutes.get(
  "/:uid/:dataType/:fileName",
  mediaUploadService.getPreSignedUrl.bind(mediaUploadService)
);





