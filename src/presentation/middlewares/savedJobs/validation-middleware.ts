import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

interface SavedJobInput {
  Realtor: string;
  Job: string;
}

const savedJobValidator = function (input: SavedJobInput): SavedJobInput {
  const savedJobSchema = Joi.object<SavedJobInput>({
    Realtor: Joi.string().required().uuid().messages({
      "string.base": "Realtor must be a string",
      "string.empty": "Realtor is required",
      "string.hex": "Invalid Realtor format",
      "any.required": "Realtor is required",
    }),
    Job: Joi.string().required().uuid().messages({
      "string.base": "Job must be a string",
      "string.empty": "Job is required",
      "string.hex": "Invalid Job format",
      "any.required": "Job is required",
    }),
  });

  const { error, value } = savedJobSchema.validate(input, {
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

export const validateSavedJobInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the agreement input using the savedJobValidator
    const validatedInput: SavedJobInput =savedJobValidator(body);

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

export default savedJobValidator;
