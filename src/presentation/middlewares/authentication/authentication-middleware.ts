import { Request, Response, NextFunction, RequestHandler } from "express";
import admin from "firebase-admin"
// import serviceAccount from "../../../../"
import * as path from "path";

// Assuming serviceAccount.json is in the app folder
const serviceAccountPath = path.join(__dirname, "../../../../fire-base-service.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://your-project-id.firebaseio.com",
});

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