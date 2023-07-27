import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import signedUrlRouter from "./routes/signedUrl.routes";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(cors());
app.use(morgan("common"));
app.use(express.json());

// routers
app.use("/api/signed-url", signedUrlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
