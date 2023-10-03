
import { connectionsRouter } from "@presentation/routes/connections";
import { clientTagCategoryRouter } from "@presentation/routes/client-tag-category-route";

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
  app.use("/api/v1/connection", clientTagCategoryRouter);

  app.use(router);
};




