import Joi, { ValidationErrorItem } from "joi";
import ApiError from "@presentation/error-handling/api-error";
import { Request, Response, NextFunction } from "express";
import { DataTypes } from "sequelize";
import Realtors from "@data/realtors/model/realtor-model";

// Define the structure of the expected input data for the Message model
interface MessageInput {
  senderId: string;
  receiverId: string;
  message: string;
  connectionId: number;
  messageType: string;
  seen:boolean;
}

// Create a function for validating the Message input
const messageValidator = async (input: MessageInput, isUpdate: boolean = false) => {
  // Define a schema for validating the input using Joi
  const messageSchema = Joi.object<MessageInput>({
    senderId: Joi.string().required().messages({
      "string.base": "SenderId must be a string",
      "any.required": "SenderId is required",
    }),
    receiverId: Joi.string().required().messages({
      "string.base": "ReceiverId must be a string",
      "any.required": "ReceiverId is required",
    }),
    connectionId: Joi.number().required().messages({
      "number.base": "ConnectionId must be a number",
      "any.required": "ConnectionId is required",
    }),
    message: Joi.string().required().messages({
      "string.base": "Message must be a string",
      "any.required": "Message is required",
    }),
    messageType: Joi.string().valid("Text", "Image", "Others").required().messages({
      "any.only": "Invalid messageType",
      "any.required": "MessageType is required",
    }),
    seen: Joi.boolean().optional(),
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
