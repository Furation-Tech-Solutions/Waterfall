import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

interface FeedBackInput {
  fromRealtor: string,
  toRealtor: string,
  jobId: string,
  rating: number,
  description: string
}

const feedBackValidator = (
  input: FeedBackInput,
  isUpdate: boolean = false
) => {
  const feedBackSchema = Joi.object<FeedBackInput>({
    fromRealtor: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    toRealtor: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    jobId: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    rating: isUpdate
      ? Joi.number().min(1).max(5).optional()
      : Joi.number().min(1).max(5).required(),
    description: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim()
  });

  const { error, value } = feedBackSchema.validate(input, {
    abortEarly: false,
  });

  if (error) {
    const validationErrors: string[] = error.details.map(
      (err: ValidationErrorItem) => err.message
    );
    throw new ApiError(
      ApiError.badRequest().status,
      validationErrors.join(", "),
      "ValidationError"
    );
  }

  return value;
};

export const validateFeedBackInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client feedBack  input using the feedBackValidator
      const validatedInput: FeedBackInput = feedBackValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // if (error instanceof ApiError) {
      //   return res.status(error.status).json(error.message);
      // }

      // Respond with the custom error
      // const err = ApiError.badRequest();
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  };
};
