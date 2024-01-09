const express = require("express");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { UserRouter } = require("./api/users");
const mongoose = require("mongoose");
const { TasksRouter } = require("./api/tasks");

const PORT = process.env.APP_SVC_SERVICE_PORT || 8081;

const connectDB = async () => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS } = process.env;
  try {
    await mongoose.connect(
      `mongodb://${DB_USER || "admin"}:${
        DB_PASS || "pass"
      }@${DB_HOST}:${DB_PORT}`,
      {
        dbName: "tasks",
      }
    );
  } catch (err) {
    console.log(err);
  }
};

app.use(cors());
app.use((req, _, next) => {
  console.log(req.path);
  return next();
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers["origin"] || "*");
  return next();
});
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("OK");
});
app.get("/health", (req, res) => {
  res.send("OK");
});
app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.use(UserRouter);
app.use(TasksRouter);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

connectDB();
