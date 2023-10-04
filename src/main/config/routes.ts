
import { realtorRouter } from "@presentation/routes/realtor-routes";
import { jobRouter } from "@presentation/routes/job-routes";
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

  app.use("/api/v1/realtors", realtorRouter);
  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/feedbacks", feedBackRouter);

  app.use(router);
};




