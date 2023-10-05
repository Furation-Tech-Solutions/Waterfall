import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

interface ReportInput {
  fromRealtor: string;
  toRealtor: string;
  description: string;
  reportTimestamp?: Date; // Optional field, adjust as needed
}

const reportValidator = function (input: ReportInput): ReportInput {
  const reportSchema = Joi.object<ReportInput>({
    fromRealtor: Joi.string().required().uuid().messages({
      "string.base": "From Realtor must be a string",
      "string.empty": "From Realtor is required",
      "string.hex": "Invalid From Realtor format",
      "any.required": "From Realtor is required",
    }),
    toRealtor: Joi.string().required().uuid().messages({
      "string.base": "To Realtor must be a string",
      "string.empty": "To Realtor is required",
      "string.hex": "Invalid To Realtor format",
      "any.required": "To Realtor is required",
    }),
    description: Joi.string().required().min(1).max(1000).messages({
      "string.base": "Description must be a string",
      "string.empty": "Description is required",
      "string.min": "Description should be at least 1 character",
      "string.max": "Description should be under 1000 characters",
      "any.required": "Description is required",
    }),
    reportTimestamp: Joi.date().messages({
      "date.base": "Report Timestamp must be a valid date",
    }),
  });

  const { error, value } = reportSchema.validate(input, {
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

export const validateReportInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the report input using the reportValidator
    const validatedInput: ReportInput = reportValidator(body);

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

export default reportValidator;
