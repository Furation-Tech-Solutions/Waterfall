import 'module-alias/register'
import setupApp from '@main/config/app'
import env from '@main/config/env'
import { Sequelize } from 'sequelize';
import ApiError from '@presentation/error-handling/api-error';
import * as  Message from '@presentation/error-handling/message-error'
import sequelize from "@main/sequalizeClient";

const app = setupApp();



// MongoDB connection function 
const postgressURL = env.postgressURL;

try {
  if (postgressURL === undefined) {
    throw ApiError.mongoError();
  }

  // (async () => {
  //   await sequelize.sync({ force: true });
  //   // Code here
  // })();

  //   try {
  //     await sequelize.authenticate();
  //     console.log('Connection has been established successfully.');
  // } catch (error) {
  //     console.error('Unable to connect to the database:', error);
  // }

  app.listen(env.port, () => {
    console.log(`${Message.SERVER_RUNNING} ${env.port}`);
  });

} catch (error) {

  console.log("error is this-", error, "error")
  if (error instanceof ApiError) {
    console.log(error.message)
  }

  const intererror = ApiError.internalError()
  console.log(intererror)
}





