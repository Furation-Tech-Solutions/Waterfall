// Import necessary routers for different routes
import { realtorRouter } from "@presentation/routes/realtor-routes";
import { blockingRouter } from "@presentation/routes/blocking-routes";
import { fqaRouter } from "@presentation/routes/fqa-routes";
import { jobRouter } from "@presentation/routes/job-routes";
import { jobApplicantRouter } from "@presentation/routes/jobApplicants-routes";
import { savedJobRouter } from "@presentation/routes/savedJobs-routes";
import { connectionsRouter } from "@presentation/routes/connections";
import { feedBackRouter } from "@presentation/routes/feedBack-routes";

// Import Express and Router types
import { Express, Router } from "express";

// Export a function that sets up routes for the Express app
export default (app: Express): void => {
  const router = Router();

  // Define a health endpoint for basic health checks
  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  // Define a test endpoint for testing purposes
  app.get("/test", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  // Use different routers for specific API endpoints
  app.use("/api/v1/realtors", realtorRouter);
  app.use("/api/v1/blockings", blockingRouter);
  app.use("/api/v1/fqas", fqaRouter);
  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/jobApplicants", jobApplicantRouter);
  app.use("/api/v1/savedJobs", savedJobRouter);
  app.use("/api/v1/connections", connectionsRouter);
  app.use("/api/v1/feedbacks", feedBackRouter);

  // Use the main router for the Express app
  app.use(router);
};
