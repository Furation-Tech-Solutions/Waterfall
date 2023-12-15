import { Request, Response, NextFunction, RequestHandler } from "express";
import admin from "../../../main/firebase-sdk/firebase-config"
// import serviceAccount from "../../../../"
import * as path from "path";



 export const verifyUser=async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
      const authHeader: string | undefined = req.header("Authorization");

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const idToken = authHeader.split(" ")[1]; // Extracting the token part after "Bearer "

    const user = await admin.auth().verifyIdToken(idToken);

    if (user) {
      req.user = user.uid;
      next();
    } else {
      throw new Error("Unauthorized");
    }
  }
    
    catch(err){
     res.status(401).send("Unauthorized");
    // console.log(err)
   }

}