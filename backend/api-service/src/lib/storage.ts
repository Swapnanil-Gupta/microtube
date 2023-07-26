import { Storage } from "@google-cloud/storage";
import credentials from "./credentials";

const storage = new Storage({
  keyFilename: credentials.serviceAccount,
});

const unprocessedVideosBucket = storage.bucket("unprocessed-videos");

export default storage;
export { unprocessedVideosBucket };
