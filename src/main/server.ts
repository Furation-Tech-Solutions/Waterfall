import "module-alias/register";
import setupApp from "@main/config/app";
import env from "@main/config/env";
import ApiError from "@presentation/error-handling/api-error";
import * as Message from "@presentation/error-handling/message-error";
import { sequelize } from "@main/sequelizeClient";
import { deleteStatusWithCron } from "@presentation/middlewares/cron/deleteUserCron";
import { CronJob, notificationWithCron } from "@presentation/middlewares/cron/pushNotificationCron";
import { Server, Socket } from "socket.io";


const app = setupApp();

// MongoDB connection function
const postgressURL = env.postgressURL;

try {
  if (postgressURL === undefined) {
    throw ApiError.SQLError();
}

  sequelize.sync().then(() => {
   const server = app.listen(env.port, () => {
     console.log("Table synchronized successfully.");
     console.log(`${Message.SERVER_RUNNING}  ${env.port}`);
   });
   const io = new Server(server, {
     pingTimeout: 60000,
     cors: {
       origin: "*",
     },
   });

   io.on("connection", (socket) => {
     socket.on("joinRoom", (connectionId) => {
       socket.join(connectionId);
     });
     socket.on("sendMessage", ({ connectionId, senderId, content }) => {
       io.to(connectionId).emit("newMessage", { senderId, content });
     });
   });
  });


  deleteStatusWithCron();
  const cronClass = new CronJob()
  cronClass.expiredJobNotification()
  cronClass.notifyOwnerNoApplicants()


} catch (error) {
  console.log("error is this-", error, "error");
  if (error instanceof ApiError) {
    console.log(error.message);
  }

  const intererror = ApiError.internalError();
  console.log(intererror);
}
