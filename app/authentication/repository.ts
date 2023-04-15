import { Connection } from "mongoose";
import bcrypt from "bcryptjs";
import { suid } from 'rand-token';

const saltRounds = 10;

export class AuthenticationRepository {
  db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async register(
    email: string,
    password: string,
    name: string
  ) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    //process your param
    const hashPassword = await bcrypt.hash(password, saltRounds)
    const params = {
      "email": email,
      "password": hashPassword,
      "name": name
    }
    return this.db.collection('user').insertOne(params);
  }

  async getUser(
    email: string
  ) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    //build your query
    const matchParam = {
      "email": email
    };
    //execute and return it
    return this.db.collection('user').findOne(matchParam);
  }

  async isPasswordMatch(
    password: string,
    hash: string
  ) {
    return await bcrypt.compare(password, hash)
  }

  async generateToken(user_id: string) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    const matchParam = {
      user_id: user_id
    }
    const params = {
      token: suid(16),
      user_id: user_id,
      created_at: new Date(),
    }
    return this.db.collection('access_tokens').updateOne(matchParam, { $set: params}, { upsert: true })
  }

  async getToken(user_id: string) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    const matchParam = {
      user_id: user_id
    };
    return this.db.collection('access_tokens').findOne(matchParam);
  }

  async logout(token: string) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    const matchParam = {
      token: token
    };
    return this.db.collection('access_tokens').remove(matchParam);
  }
}