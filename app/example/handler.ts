
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
import { ExampleController } from './controller';
import { ExampleRepository } from './repository';

const controller = new ExampleController();
let initialized = false;

const init = async () => {
  // get from env
  const uri = process.env.DB_URL || "";
  const connection: Connection = await getConnection(uri);
  const repository = new ExampleRepository(connection);
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

export const getSomething: Handler = async (event: any) => {
  if(!initialized) await init();
  if(!authorized(event.headers)) return MessageUtil.error(401, "Unauthorized");
  return controller.getSomething(event);
};

export const getSomethingList: Handler = async (event: any) => {
  if(!initialized) await init();
  if(!authorized(event.headers)) return MessageUtil.error(401, "Unauthorized");
  return controller.getSomethingList(event);
};
