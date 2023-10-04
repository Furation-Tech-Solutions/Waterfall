import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

interface FQAInput {
  question: string,
  answer: string
}

const fqaValidator = (
  input: FQAInput,
  isUpdate: boolean = false
) => {
  const fqaSchema = Joi.object<FQAInput>({
    question: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim(),
    answer: isUpdate
      ? Joi.string().optional().trim()
      : Joi.string().required().trim()
  });

  const { error, value } = fqaSchema.validate(input, {
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

export const validateFQAInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the client fqa  input using the fqaValidator
      const validatedInput: FQAInput = fqaValidator(
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
