import { Request, Response, NextFunction, RequestHandler } from "express";
import admin from "../../../main/firebase-sdk/firebase-config";
// import serviceAccount from "../../../../"
import * as path from "path";
import ApiError from "@presentation/error-handling/api-error";
import { GetRealtorById } from "@domain/realtors/usecases/get-realtor-by-id";
import { RealtorDataSourceImpl } from "@data/realtors/datasources/realtor-data-source";
import { Sequelize } from "sequelize";
import { sequelize } from "@main/sequelizeClient";




 export const verifyUser=async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
      const authHeader: string | undefined = req.header("Authorization");
     
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // throw ApiError.customError(401,"you are not authorized");
      return res
      .status(401)
      .json({ message: "You are not Authorized" });
    }

    let realtorDataSource = new RealtorDataSourceImpl(sequelize)
     
    const idToken = authHeader.split(" ")[1]; // Extracting the token part after "Bearer "
    try {
      
      const user = await admin.auth().verifyIdToken(idToken);
      if (user) {
        const dbUser = await realtorDataSource.read(user.uid)
        if(dbUser) {
          req.user = user.uid;
          next()
        }
      
    }
    } catch (error:any) {
      if(error.status==404){
        return res.status(401).json({ message: "User is not present in database" });
         
      }
      else{
      return res.status(401).json({ message: "Token verification failed" });
      }
    }
  
  }
  

