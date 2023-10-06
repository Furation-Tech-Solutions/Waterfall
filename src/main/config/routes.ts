
import { connectionsRouter } from "@presentation/routes/connections";
import { realtorRouter } from "@presentation/routes/realtor-routes";
import { blockingRouter } from "@presentation/routes/blocking-routes";
import { fqaRouter } from "@presentation/routes/fqa-routes";
import { feedBackRouter } from "@presentation/routes/feedBack-routes";

import { type Express, Router } from "express";

export default (app: Express): void => {
  const router = Router();

  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.get("/test", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.use("/api/v1/connections", connectionsRouter);
  app.use("/api/v1/realtors", realtorRouter);
  app.use("/api/v1/blockings", blockingRouter);
  app.use("/api/v1/fqas", fqaRouter);
  app.use("/api/v1/feedbacks", feedBackRouter);

  app.use(router);
};




