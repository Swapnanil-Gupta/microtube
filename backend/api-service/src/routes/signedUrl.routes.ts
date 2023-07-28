import { Router } from "express";
import { generateSignedUrl } from "../controllers/signedUrl.controller";

const signedUrlRouter = Router();

signedUrlRouter.get("/", generateSignedUrl);

export default signedUrlRouter;
