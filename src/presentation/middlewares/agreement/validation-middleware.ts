import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { statusEnum } from "@data/agreement/models/agreement-models"; // Assuming you have this enum imported

interface AgreementInput {
  jobApplicant: string;
  Agree: boolean;
  status: string;
  agreementTimestamp: Date;
}

const agreementValidator = function (input: AgreementInput): AgreementInput {
  const agreementSchema = Joi.object<AgreementInput>({
    jobApplicant: Joi.string().required().uuid().messages({
      "string.base": "Job applicant must be a string",
      "string.empty": "Job applicant is required",
      "string.uuid": "Invalid job applicant format",
      "any.required": "Job applicant is required",
    }),
    Agree: Joi.boolean().required().messages({
      "boolean.base": "Agree must be a boolean",
      "any.required": "Agree is required",
    }),
    status: Joi.string()
      .valid(...Object.values(statusEnum))
      .required()
      .messages({
        "any.only": "Invalid status",
        "any.required": "Status is required",
      }),
    agreementTimestamp: Joi.date().messages({
      "date.base": "Agreement timestamp must be a valid date",
      "any.required": "Agreement timestamp is required",
    }),
  });

  const { error, value } = agreementSchema.validate(input, {
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

export const validateAgreementInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the request body
    const { body } = req;

    // Validate the agreement input using the agreementValidator
    const validatedInput: AgreementInput = agreementValidator(body);

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

export default agreementValidator;
