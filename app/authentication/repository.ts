import { Connection } from "mongoose";

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const mongoose = require('mongoose');

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
    return bcrypt.genSalt(saltRounds, function (saltError, salt) {
      if (saltError) {
        return saltError
      } else {
        bcrypt.hash(password, salt, function(hashError, hash) {
          if (hashError) {
            return hashError
          }
          const params = {
            email: email,
            password: hash,
            name: name
          }
          return this.db.collection('user').insertOne(params);
        })
      }
    })
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
}