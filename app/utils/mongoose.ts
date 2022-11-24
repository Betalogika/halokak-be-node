import { createConnection } from "mongoose";

export const getConnection = async (uri:string) => {
  return createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Buffering means mongoose will queue up operations if it gets
    // disconnected from MongoDB and send them when it reconnects.
    // With serverless, better to fail fast if not connected.
    bufferCommands: false, // Disable mongoose buffering
    // and tell the MongoDB driver to not wait more than 5 seconds
    // before erroring out if it isn't connected
    serverSelectionTimeoutMS: 5000
  });
}