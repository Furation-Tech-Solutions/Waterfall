import "module-alias/register";
import setupApp from "@main/config/app";
import env from "@main/config/env";
import { Sequelize } from "sequelize";
import ApiError from "@presentation/error-handling/api-error";
import * as Message from "@presentation/error-handling/message-error";
import sequelize from "@main/sequelizeClient";

const app = setupApp();

// MongoDB connection function
const postgressURL = env.postgressURL;

try {
  if (postgressURL === undefined) {
    throw ApiError.mongoError();
  }

  // Sync the model with the database
  // async function syncDatabase() {
  //   try {
  //     await sequelize.sync({ force: true });
  //     console.log("Table synchronized successfully.");
  //   } catch (error) {
  //     console.error("Error syncing table:", error);
  //   }
  // }
  // syncDatabase();

  app.listen(env.port, () => {
    console.log(`${Message.SERVER_RUNNING} ${env.port}`);
  });
} catch (error) {
  console.log("error is this-", error, "error");
  if (error instanceof ApiError) {
    console.log(error.message);
  }

  const intererror = ApiError.internalError();
  console.log(intererror);
}
