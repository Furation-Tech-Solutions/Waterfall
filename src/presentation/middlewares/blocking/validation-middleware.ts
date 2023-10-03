import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

interface BlockingInput {
  fromRealtor: string,
  toRealtor: string
}

const blockingValidator = (
  input: BlockingInput,
  isUpdate: boolean = false
) => {
  const blockingSchema = Joi.object<BlockingInput>({
    fromRealtor: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    toRealtor: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim()
  });

  const { error, value } = blockingSchema.validate(input, {
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

export const validateBlockingInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client blocking  input using the blockingValidator
      const validatedInput: BlockingInput = blockingValidator(
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
