import { agreementRouter } from "@presentation/routes/agreement-routes";
import { jobRouter } from "@presentation/routes/job-routes";
import { jobApplicantRouter } from "@presentation/routes/jobApplicants-routes";
import { upcomingTaskRouter } from "@presentation/routes/upcomingTask-routes";

import { type Express, Router } from "express";

export default (app: Express): void => {
  const router = Router();

  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.get("/test", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/jobApplicants", jobApplicantRouter);
  app.use("/api/v1/agreements", agreementRouter);
  app.use("/api/v1/upcomingTasks", upcomingTaskRouter);

  app.use(router);
};
