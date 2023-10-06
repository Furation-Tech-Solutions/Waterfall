import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

interface SupportInput {
  realtor: string;
  to: string;
  description: string;
  attachments: string[] | undefined;
  timestamp?: Date;
}

const supportValidator = function (input: SupportInput): SupportInput {
  const supportSchema = Joi.object<SupportInput>({
    realtor: Joi.string().required().uuid().messages({
      "string.base": "Realtor must be a string",
      "string.empty": "Realtor is required",
      "string.uuid": "Invalid realtor UUID format",
      "any.required": "Realtor is required",
    }),
    to: Joi.string().required().messages({
      "string.base": "To must be a string",
      "string.empty": "To is required",
      "any.required": "To is required",
    }),
    description: Joi.string().required().min(1).max(1000).messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "string.min": "Description should be at least 1 character",
      "string.max": "Description should be under 1000 characters",
      "any.required": "Description is required",
    }),
    attachments: Joi.array().items(Joi.string().uri()).messages({
      "array.base": "Attachments must be an array of strings",
      "array.items": "Attachments must be valid URIs",
    }),
    timestamp: Joi.date().default(new Date()).messages({
      "date.base": "Report timestamp must be a valid date",
    }),
  });

  const { error, value } = supportSchema.validate(input, {
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

export const validateSupportInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the support input using the supportValidator
    const validatedInput: SupportInput = supportValidator(body);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json(error.message);
    }

    // Respond with the custom error
    const err = ApiError.badRequest();
    return res.status(err.status).json(err.message);
  }
};

export default supportValidator;
