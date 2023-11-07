const express = require("express");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { UserRouter } = require("./api/users");
const mongoose = require("mongoose");
const { TasksRouter } = require("./api/tasks");

const PORT = process.env.APP_SVC_SERVICE_PORT || 8081;

const connectDB = async () => {
  const { DB_HOST, DB_PORT } = process.env;
  try {
    await mongoose.connect(`mongodb://admin:pass@${DB_HOST}:${DB_PORT}`, {
      dbName: "tasks",
    });
  } catch (err) {
    console.log(err);
  }
};

app.use(cors());
app.use(express.json());
app.use(cookieParser());

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
