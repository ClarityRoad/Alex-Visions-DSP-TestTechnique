import mongoose from "mongoose";
import { app } from "./app";
import { env } from "./config/env";

mongoose.connect(env.mongoUri as string).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error", err);
});

app.listen(env.port, () => {
  console.log(`Visions test app listening on port ${env.port}`);
});