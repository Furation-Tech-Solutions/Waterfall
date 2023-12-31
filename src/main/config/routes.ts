import { type Express, Router } from "express";
// Import necessary routers for different routes
import { callLogRouter } from "@presentation/routes/callLog-routes";
import { realtorRouter } from "@presentation/routes/realtor-routes";
import { blockingRouter } from "@presentation/routes/blocking-routes";
import { faqRouter } from "@presentation/routes/faq-routes";
import { jobRouter } from "@presentation/routes/job-routes";
import { jobApplicantRouter } from "@presentation/routes/jobApplicants-routes";
import { savedJobRouter } from "@presentation/routes/savedJobs-routes";
import { connectionsRouter } from "@presentation/routes/connections";
import { feedBackRouter } from "@presentation/routes/feedBack-routes";
import { reportRouter } from "@presentation/routes/report-routes";
import { bugReportRouter } from "@presentation/routes/bugReport-routes";
import { supportRouter } from "@presentation/routes/support-routes";
import { notInterestedRouter } from "@presentation/routes/notInterested-routes";
import { paymentGatewayRouter } from "@presentation/routes/paymentGateway-routes";
import { messagesRouter } from "@presentation/routes/messages-routes";
import { mediaRoutes } from "@presentation/routes/media-upload-routes";
import { scrapperRouter } from "@presentation/routes/webScrapping-routes";
import { notificationRouter } from "@presentation/routes/notification";
// import { homepageRouter } from "@presentation/routes/screens/Home_Screens/Final_Home_Page_To_Apply_jobs";



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
  app.use("/api/v1/faqs", faqRouter);
  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/jobApplicants", jobApplicantRouter);
  app.use("/api/v1/savedJobs", savedJobRouter);
  app.use("/api/v1/connections", connectionsRouter);
  app.use("/api/v1/feedbacks", feedBackRouter);
  app.use("/api/v1/reports", reportRouter);
  app.use("/api/v1/bugReports", bugReportRouter);
  app.use("/api/v1/supports", supportRouter);
  app.use("/api/v1/callLogs", callLogRouter);
  app.use("/api/v1/paymentGateways", paymentGatewayRouter);
  app.use("/api/v1/notInteresteds", notInterestedRouter);
  app.use("/api/v1/messages", messagesRouter);
  app.use("/api/v1/uploadMedia", mediaRoutes);
  app.use("/api/v1/searchRecoNumber", scrapperRouter);
  app.use("/api/v1/notification", notificationRouter);
  app.use(router);

  // -------------------------------------------------------------------
  // app.use("/api/v1/homepage", homepageRouter);



  // -------------------------------------------------------------------


};
