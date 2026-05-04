import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { dbConnection } from "./utils/index.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();


app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://tasky-project-assignment.netlify.app",
        process.env.FRONTEND_URL,
      ];

      const isAllowed = !origin ||
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app") ||
        origin.includes("onrender.com");

      console.log(`CORS check for origin: ${origin} -> Allowed: ${isAllowed}`);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked Origin: ${origin}`);
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


app.get("/", (req, res) => {
  res.send("Server is running correctly...");
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
