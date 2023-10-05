import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

// Define the BugReport input schema
const bugReportSchema = Joi.object({
  Realtor: Joi.string().uuid().required().messages({
    "string.base": "Realtor must be a valid UUID",
    "string.empty": "Realtor is required",
    "string.uuid": "Realtor must be a valid UUID",
    "any.required": "Realtor is required",
  }),
  description: Joi.string().required().max(1000).messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.max": "Description should be at most 1000 characters",
    "any.required": "Description is required",
  }),
  attachments: Joi.array().items(Joi.string().uri()).allow(null).messages({
    "array.base": "Attachments must be an array of strings",
    "array.items": "Attachments must be valid URIs",
  }),
  reportTimestamp: Joi.date().default(new Date()).messages({
    "date.base": "Report timestamp must be a valid date",
  }),
});

const validateBugReportInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the BugReport input using the bugReportSchema
    const { error, value } = bugReportSchema.validate(body, {
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

    // Set the validated input in the request body
    req.body = value;

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

export default validateBugReportInputMiddleware;
