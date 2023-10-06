require("dotenv").config();

export default {
  port: process.env.PORT ?? 3000,
  mongoUrl: process.env.MONGO_URL,
  dbOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "waterfall",
  },
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "XXXXXXXXXXXXXXXXXXXX",
  secretAccessKey:
    process.env.AWS_SECRET_ACCESS_KEY ??
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  mailhost: process.env.HOST,
  sendmailport: process.env.MAILPORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  postgressURL: process.env.POSTGRESS_URL ?? "",
};
