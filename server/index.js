import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { dbConnection } from "./utils/index.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

app.set("trust proxy", 1); // Enable trust proxy for Render/Vercel load balancers

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://tasky-one-iota.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.includes(origin) ||
        origin?.endsWith?.(".vercel.app") ||
        process.env.FRONTEND_URL === origin;

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);
app.use("/api/task", taskRoutes); // Direct mount for safety
app.use("/api/user", userRoutes); // Direct mount for safety
app.use("/", routes); 

app.get("/", (req, res) => {
  res.send("Server is running correctly...");
});
app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
