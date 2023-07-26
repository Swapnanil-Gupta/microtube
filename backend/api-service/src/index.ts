import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { unprocessedVideosBucket } from "./lib/storage";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("common"));
app.use(express.json());

app.get("/", async (req, res) => {
  const [files] = await unprocessedVideosBucket.getFiles();
  res.json(files);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
