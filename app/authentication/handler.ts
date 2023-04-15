
import { Handler } from 'aws-lambda';
import dotenv from 'dotenv';
import { Connection } from 'mongoose';
import path from 'path';
import { MessageUtil } from '../utils/message';
import { getConnection } from '../utils/mongoose';
const dotenvPath = path.join(__dirname, '../', `.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});
import { AuthenticationController } from './controller';
import { AuthenticationRepository } from './repository';

const controller = new AuthenticationController();
let initialized = false;

const init = async () => {
  // get from env
  const uri = process.env.DB_URL || "";
  const connection: Connection = await getConnection(uri);
  const repository = new AuthenticationRepository(connection);
  controller.setRepo(repository);
  initialized = true;
};

const authorized = (headers) => {
  if(headers.api_key) {
    return process.env.API_KEY === headers.api_key;
  } else {
    return process.env.API_KEY === headers.API_KEY;
  }
}

export const register: Handler = async (event: any) => {
  if(!initialized) await init();
  if(!authorized(event.headers)) return MessageUtil.error(401, "Unauthorized");
  return controller.register(event);
};

export const login: Handler = async (event: any) => {
  if(!initialized) await init();
  if(!authorized(event.headers)) return MessageUtil.error(401, "Unauthorized");
  return controller.login(event);
};

export const logout: Handler = async (event: any) => {
  if(!initialized) await init();
  if(!authorized(event.headers)) return MessageUtil.error(401, "Unauthorized");
  return controller.logout(event);
};
