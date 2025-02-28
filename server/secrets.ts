import dotenv from "dotenv";

dotenv.config();

export const { SERVER_SECRET_KEY, SERVER_PORT } = process.env;
