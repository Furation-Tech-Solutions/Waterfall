import * as HttpStatus from "./http-status";

import { executionAsyncId } from "async_hooks";
import * as ErrorMessage from "./message-error";

export class ErrorClass extends Error {
  status: number;
  message: string;
  name: string;

  constructor(status: number, message: string, name: string) {
    super();
    this.status = status;
    this.message = message;
    this.name = name;
  }
}

class ApiError extends ErrorClass {
  constructor(status: number, message: string, name: string = "ApiError") {
    super(status, message, name);
  }

  static customError(status: number, specificMessage: string): ApiError {
    return new ApiError(status, specificMessage);
  }

  static getOk(): ApiError {
    return new ApiError(HttpStatus.OK, ErrorMessage.FETCH_SUCCESS, "OK");
  }

  static created(): ApiError {
    return new ApiError(
      HttpStatus.CREATED,
      ErrorMessage.CREATE_SUCCESS,
      "Created"
    );
  }

  static delete(): ApiError {
    return new ApiError(HttpStatus.OK, ErrorMessage.DELETED_SUCCESS, "Deleted");
  }

  static noContent(): ApiError {
    return new ApiError(
      HttpStatus.NO_CONTENT,
      ErrorMessage.DELETED_SUCCESS,
      "NoContent"
    );
  }

  static notFound(): ApiError {
    return new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorMessage.NOT_FOUND,
      "notfound"
    );
  }

  static badRequest(): ApiError {
    return new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorMessage.BAD_REQUEST,
      "badRequest"
    );
  }

  static unAuthorized(): ApiError {
    return new ApiError(
      HttpStatus.UNAUTHORIZED,
      ErrorMessage.UNAUTHORIZED,
      "unAuthorized"
    );
  }

  static noService(): ApiError {
    return new ApiError(
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorMessage.SERVICE_UNAVAILABLE,
      "noService"
    );
  }

  static emailExist(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.EMAIL_CONFLICT, "email_conflict");
  }
  static nameExist(): ApiError {
    return new ApiError(
      HttpStatus.CONFLICT,
      ErrorMessage.NAME_EXIST,
      "nameExist"
    );
  }

  static internalError(): ApiError {
    return new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorMessage.INTERNAL_SERVER_ERROR,
      "internalError"
    );
  }

  static SQLError(): ApiError {
    return new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorMessage.UNDEFINE_MESSAGE,
      "undifined"
    );
  }

  static awsPresigningError(): ApiError {
    return new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorMessage.AWS_PRESIGN_ERROR,
      "awsPresigningError"
    );
  }
  static forbidden(): ApiError {
    return new ApiError(
      HttpStatus.FORBIDDEN,
      ErrorMessage.FORBIDDEN,
      "forbidden"
    );
  }
  static brandLogoDeletionError(): ApiError {
    return new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorMessage.BRAND_LOGO_DELETION_ERROR,
      "brandLogoDeletionError"
    );
  }

  static overlappingShift(): ApiError {
    return new ApiError(
      HttpStatus.CONFLICT,
      ErrorMessage.OVERLAPPING_SHIFT,
      "Overlapping"
    );
  }

  static overlappingBlackoutDate(): ApiError {
    return new ApiError(
      HttpStatus.CONFLICT,
      ErrorMessage.OVERLAPPING_DATE,
      "dateoverlap"
    );
  }
  static roleExist(): ApiError {
    return new ApiError(
      HttpStatus.ROLECONFLICT,
      ErrorMessage.ROLE_CONFLICT,
      "conflictWithRole"
    );
  }
  static taxTypeExist(): ApiError {
    return new ApiError(
      HttpStatus.CONFLICT,
      ErrorMessage.TAX_TYPE_EXIST,
      "taxTypeExist"
    );
  }
  static clientExist(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.CONFLICT, "conflict");
  }
  static clienttagExist(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.CONFLICT, "conflict");
  }
  static connectionExist(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.CONFLICT, "conflict");
  }
  static guestExist(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.CONFLICT, "conflict");
  }
  static bookingRequestExists(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.CONFLICT, "conflict");
  }
  static userNotFound(): ApiError {
    return new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorMessage.NO_USERS_FOUND,
      "no user found"
    );
  }

  
  static idBlocked(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.ID_BLOCKED_CONFLICT, "idBlocked_conflict");
  }

  static feedBackGiven(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.FEEDBACK_CONFLICT, "feedBack_conflict");
  }

  static questionExist(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.QUESTION_CONFLICT, "question_conflict");
  }

  static realtorExist(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.REALTOR_CONFLICT, "realtor_conflict");
  }
}

export default ApiError;
