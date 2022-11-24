import { Connection } from "mongoose";
const mongoose = require('mongoose');

export class ExampleRepository {
  db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async getSomething(
    id: string
  ) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    //process your param
    let objectId = new mongoose.Types.ObjectId(id);
    //build your query
    const matchParam = {
      "_id": objectId
    };
    //execute and return it
    return this.db.collection('user').findOne(matchParam);
  }

  async getSomethingList(
    page?: number,
    limit?: number,
    isAll?: boolean
  ) {
    //check db conneted or not
    if (!this.db) throw new Error("Database not connected.");
    //build your query
    const matchParam = {
        $match: {
          }
    };
    const pipeline: any = [
        matchParam
    ];
    if(!isAll && page && limit) {
        pipeline.push({ $skip: (page - 1) * limit });
        pipeline.push({ $limit: limit });
      }
    //execute and return it
    return this.db.collection('user').aggregate(pipeline).toArray();
  }
}