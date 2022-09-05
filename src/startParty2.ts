import ServerlessHttp from "serverless-http";
import app from './party2-express';

export const handler = ServerlessHttp(app);
