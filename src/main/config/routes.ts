import { callLogRouter } from "@presentation/routes/callLog-routes";
import { blockingRouter } from "@presentation/routes/blocking-routes";
import { fqaRouter } from "@presentation/routes/fqa-routes";
import { realtorRouter } from "@presentation/routes/realtor-routes";
import { jobRouter } from "@presentation/routes/job-routes";
import { jobApplicantRouter } from "@presentation/routes/jobApplicants-routes";
import { savedJobRouter } from "@presentation/routes/savedJobs-routes";
import { connectionsRouter } from "@presentation/routes/connections";

import { type Express, Router } from "express";
import { reportRouter } from "@presentation/routes/report-routes";
import { bugReportRouter } from "@presentation/routes/bugReport-routes";
import { supportRouter } from "@presentation/routes/support-routes";

export default (app: Express): void => {
  const router = Router();

  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.get("/test", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.use("/api/v1/callLogs", callLogRouter);
  app.use("/api/v1/realtors", realtorRouter);
  app.use("/api/v1/blockings", blockingRouter);
  app.use("/api/v1/fqas", fqaRouter);
  app.use("/api/v1/realtors", realtorRouter);
  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/jobApplicants", jobApplicantRouter);
  app.use("/api/v1/savedJobs", savedJobRouter);
  app.use("/api/v1/connections", connectionsRouter);
  app.use("/api/v1/reports", reportRouter);
  app.use("/api/v1/bugReports", bugReportRouter);
  app.use("/api/v1/supports", supportRouter);
  app.use(router);
};




