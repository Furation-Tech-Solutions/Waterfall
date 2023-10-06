import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { OutcomeEnum } from "@data/callLog/models/callLog-model"; // Adjust the import path accordingly

interface CallLogInput {
  jobApplicant: string;
  logActivity: string;
  logOutcome: string;
}

const callLogValidator = function (input: CallLogInput): CallLogInput {
  const callLogSchema = Joi.object<CallLogInput>({
    jobApplicant: Joi.string().required().uuid().messages({
      "string.base": "jobApplicant must be a string",
      "string.empty": "jobApplicant is required",
      "string.hex": "Invalid jobApplicant format",
      "any.required": "jobApplicant is required",
    }),
    logActivity: Joi.string().required().min(1).max(500).messages({
      "string.base": "Log activity must be a string",
      "string.empty": "Log activity is required",
      "string.min": "Log activity should be at least 1 character",
      "string.max": "Log activity should be under 500 characters",
      "any.required": "Log activity is required",
    }),
    logOutcome: Joi.string()
      .valid(...Object.values(OutcomeEnum))
      .required()
      .messages({
        "any.only": "Invalid log outcome",
        "any.required": "Log outcome is required",
      }),
  });

  const { error, value } = callLogSchema.validate(input, {
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

export const validateCallLogInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the call log input using the callLogValidator
    const validatedInput: CallLogInput = callLogValidator(body);

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

export default callLogValidator;
