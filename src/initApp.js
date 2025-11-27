import { config } from "dotenv";
import * as Router from "./index.routes.js";
import connectDB from "../DB/db.connection.js";

export const initApp = (app, express) => {
  // Environment variables
  config();
  const port = +process.env.PORT || 4000;

  // parsing of JSON
  app.use(express.json());

  // Connect to the database
  // call connection function...
  connectDB();

  // Mount all routers
  app.use("/api/v1/auth", Router.authRouter);

  // Default home route
  app.get("/", (req, res) => {
    res.status(200).json({
      msg: "🚀 Express.js REST API app scaffolded using `create-express-str` CLI.",
    });
  });

  // Route not found
  app.use((req, res) => {
    res.status(404).json({ msg: `Route ${req.originalUrl} Not Found` });
  });

  // Global error handler middleware
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      status: err.status || "error",
      error: err,
      message: err.message,
      stack: err.stack,
    });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port} 🚀!...`);
  });
};
