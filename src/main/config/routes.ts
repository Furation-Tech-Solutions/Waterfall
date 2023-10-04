import { fqaRouter } from "@presentation/routes/fqa-routes";

import { type Express, Router } from "express";

export default (app: Express): void => {
  const router = Router();

  app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.get("/test", (req, res) => {
    res.status(200).json({ message: "ok" });
  });

  app.use("/api/v1/fqas", fqaRouter);

  app.use(router);
};
