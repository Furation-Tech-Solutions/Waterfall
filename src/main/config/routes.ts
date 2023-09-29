
import { clientTagCategoryRouter } from "@presentation/routes/client-tag-category-route";
import { realtorRouter } from "@presentation/routes/realtor-routes";
import { faqsRouter } from "@presentation/routes/faqs-routes";

import { type Express, Router } from "express";

export default (app: Express): void => {
  const router = Router();

  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.get("/test", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.use("/api/v1/clients/tag/category", clientTagCategoryRouter);
  app.use("/api/v1/realtor", realtorRouter);
  app.use("/api/v1/faqs", faqsRouter);

  app.use(router);
};
