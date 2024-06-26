import mongoose from "mongoose";
import logger from "./logger";

async function connect() {
  logger.info("Trying to connect MongoDB...");

  try {
    const mongodbURI = process.env.MONGODN_URI;
    await mongoose.connect(mongodbURI);
    logger.info("Successfully connected to MongoDB");
  } catch (error) {
    logger.error(`Some error occured while connecting MongoDB ${error}`);
    process.exit(1);
  }
}

export default connect;
