import { MongoClient, Db, Collection, Document } from 'mongodb';

export const MONGO_DB_URI: string = process.env.MONGO_DB_URI as string;
export const DATABASE_NAME: string = process.env.DATABASE_NAME as string;

export const USER_COLLECTION: string = 'users';

export const COLLECTION_NAMES: string[] = [
  USER_COLLECTION,
];



export abstract class ValueCollection {
  private collection: Collection<Document>;

  constructor(collection: Collection<Document>) {
    this.collection = collection;
  }

  protected async _findValue<T>(filter: any): Promise<T | null> {
    return await this.collection.findOne({...filter}) as T;
  }

  protected async _insertValue(model: any): Promise<void> {
    await this.collection.insertOne({...model});
  }

  protected async _updateValue(filter: any, model: any): Promise<void> {
    await this.collection.updateOne({...filter},{
      $set: {...model},
    });
  }

  protected async _deleteValue(filter: any): Promise<void> {
    await this.collection.deleteOne({...filter});
  }



  protected async _findValues<T>(filter: any): Promise<T[]> {
    return await this.collection.find({...filter}).toArray() as T[];
  }

  protected async _insertValues(models: any[]): Promise<void> {
    await this.collection.insertMany(models);
  }

  protected async _updateValues(filter: any[], models: any[]): Promise<void> {
    await this.collection.updateMany({ ...filter }, { $set: {...models} });
  }

  protected async _deleteValues(filter: any): Promise<void> {
    await this.collection.deleteMany({...filter});
  }
}



export class MongoDBConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  public async connect() {
    try {
      this.client = await MongoClient.connect(MONGO_DB_URI);
      this.db = this.client.db(DATABASE_NAME);
      console.log('Connected to MongoDB database successfully!');
    } catch (err) {
      console.error('Failed to connect to MongoDB database!');
      throw err;
    }
    console.log('Initializing collections...');
    await this.initCollections();
  }

  public getDB(): Db {
    if (this.db == null) {
        throw "Database not connected!";
    }
    return this.db;
  }

  public getCollection(name: string): Collection<Document> {
    return this.getDB().collection(name);
  }

  public async initCollections(): Promise<void> {
    const db = this.getDB();
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    for (let collectionName of COLLECTION_NAMES) {
      if (!collectionNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`Collection ${collectionName} created`);
      } else {
        console.log(`Collection ${collectionName} already exists`);
      }
    }
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB database successfully!');
    }
  }
}

export default new MongoDBConnection();
