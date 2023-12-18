import { Request, Response, NextFunction, RequestHandler } from "express";
import admin from "../../../main/firebase-sdk/firebase-config";
// import serviceAccount from "../../../../"
import * as path from "path";
import ApiError from "@presentation/error-handling/api-error";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader: string | undefined = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // throw ApiError.customError(401,"you are not authorized");
    return res.status(401).json({ message: "You are not Authorized" });
  }

  const idToken = authHeader.split(" ")[1]; // Extracting the token part after "Bearer "

  const user = await admin.auth().verifyIdToken(idToken);

  if (user) {
    req.user = user.uid;
    next();
  } else {
    // throw ApiError.unAuthorized()
    return res.status(401).json({ message: "You are not Authorized" });
  }
};
