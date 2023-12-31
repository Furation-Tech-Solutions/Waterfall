import "module-alias/register";
import setupApp from "@main/config/app";
import env from "@main/config/env";
import ApiError from "@presentation/error-handling/api-error";
import * as Message from "@presentation/error-handling/message-error";
import { sequelize } from "@main/sequelizeClient";
import { deleteStatusWithCron } from "@presentation/middlewares/cron/deleteUserCron";
import {
  CronJob,
  notificationWithCron,
} from "@presentation/middlewares/cron/pushNotificationCron";
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
    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: "*",
      },
    });
    let userData: any;
    io.on("connection", (socket: Socket) => {
      console.log("Connected to socket.io");

      socket.on("setup", (userData: any) => {
        socket.join(userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room: string) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("typing", (room: string) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room: string) =>
        socket.in(room).emit("stop typing")
      );

      socket.on("new message", (newMessageRecieved: any) => {
        const chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user: any) => {
          if (user._id == newMessageRecieved.sender._id) return;

          socket.in(user._id).emit("message received", newMessageRecieved);
        });
      });

      socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData?._id);
      });
    });
  });

  deleteStatusWithCron();
  const cronClass = new CronJob();
  cronClass.expiredJobNotification();
 
} catch (error) {
  console.log("error is this-", error, "error");
  if (error instanceof ApiError) {
    console.log(error.message);
  }

  const intererror = ApiError.internalError();
  console.log(intererror);
}
