import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";

interface ConnectionsInput {
  fromId: number;
  toId: number;
  connected: boolean;
}

const connectionsValidator = (
  input: ConnectionsInput,
  isUpdate: boolean = false
) => {
  const connectionsSchema = Joi.object<ConnectionsInput>({
    fromId: isUpdate
      ? Joi.number().optional().messages({
        "number.integer": "fromId should be an integer",
        "any.required": "fromId is required",
      })
      : Joi.number().optional().messages({
        "number.integer": "fromId should be an integer",
        "any.required": "fromId is required",
      }),

    toId: isUpdate
      ? Joi.number().optional().messages({
        "number.integer": "toId should be an integer",
        "any.required": "toId is required",
      })
      : Joi.number().optional().messages({
        "number.integer": "toId should be an integer",
        "any.required": "toId is required",
      }),

    connected: Joi.boolean().default(false),
  });

  const { error, value } = connectionsSchema.validate(input, {
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

export const validateConnectionsInputMiddleware = (
  isUpdate: boolean = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the connections input using the connectionsValidator
      const validatedInput: ConnectionsInput = connectionsValidator(
        body,
        isUpdate
      );

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  };
};
