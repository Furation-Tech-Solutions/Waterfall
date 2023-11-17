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

const verifyUser=async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
      const idToken: string | undefined = req.header("Authorization");

  try {
    if (!idToken) {
      throw new Error("Unauthorized");
    }

    const user = await admin.auth().verifyIdToken(idToken);

    // If verification is successful, the user is authenticated
    if (user) {
      req.user = user.email;
      next();
    } else {
      // User is not authenticated
      res.status(401).send("Unauthorized");
    }


   }
   catch(err){
    console.log(err)
   }

}