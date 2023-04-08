import { Connection } from "mongoose";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

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
    return bcrypt.compare(password, hash, function(error, isMatch) {
      if (error) {
        return false
      } else if (!isMatch) {
        return false
      } else {
        return true
      }
    });
  }

  async generateToken(user_id: string) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    const params = {
      created_at: Date(),
      user_id: user_id
    };
    return this.db.collection('access_tokens').insertOne(params);
  }

  async getToken(user_id: string) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    const matchParam = {
      "user_id": user_id
    };
    return this.db.collection('access_tokens').findOne(matchParam);
  }

  async logout(token: string) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    let objectId = new mongoose.Types.ObjectId(token);
    const matchParam = {
      "_id": objectId
    };
    return this.db.collection('access_tokens').remove(matchParam);
  }
}