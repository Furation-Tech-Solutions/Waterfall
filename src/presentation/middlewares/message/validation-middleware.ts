import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { DataTypes } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";

// Define the structure of the expected input data for the Message model
interface MessageInput {
  sender: string;
  receiver: string;
  message: string;
}

// Create a function for validating the Message input
const messageValidator = async (input: MessageInput, isUpdate: boolean = false) => {
  // Define a schema for validating the input using Joi
  const messageSchema = Joi.object<MessageInput>({
    // Validate sender
    sender: isUpdate ? Joi.string().optional() : Joi.string().required(),

    // Validate receiver
    receiver: isUpdate ? Joi.string().optional() : Joi.string().required(),

    // Validate message
    message: Joi.string().allow("").required().messages({
      "string.required": "message is required",
    }),
  });

  // Validate the input against the schema
  const { error, value } = messageSchema.validate(input, {
    abortEarly: false,
  });

  // If validation fails, throw a custom ApiError
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


  return value; // Return the validated input
};

// Define a middleware for validating Message input
export const validateMessageInputMiddleware = (isUpdate: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the request body
      const { body } = req;

      // Validate the Message input using the messageValidator
      const validatedInput: MessageInput = await messageValidator(body, isUpdate);

      // Continue to the next middleware or route handler
      next();
    } catch (error: any) {
      // Handle errors, e.g., respond with a custom error message
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
};
