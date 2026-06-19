import cors from "cors";
import express from "express";
import { config } from "./config.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import validationRoutes from "./routes/validationRoutes.js";
import combinationRoutes from "./routes/combinationRoutes.js";

const app = express();


app.use(
  cors({
    origin: config.clientUrl
  })
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok"
  });
});

app.use("/api/medicines", medicineRoutes);
app.use("/api/validate", validationRoutes);
app.use("/api/combination", combinationRoutes);


app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: "Internal server error."
  });
});

export default app;
