import mongoose from 'mongoose';
import { config } from './environment';

let isMongoConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB successfully connected at: ${config.mongoUri}`);
    return true;
  } catch (err: any) {
    isMongoConnected = false;
    console.warn(
      `[Database] Notice: MongoDB connection failed (${err.message || 'connection timeout'}). Switching to persistent local JSON datastore for zero-config evaluation.`
    );
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isMongoConnected,
  type: isMongoConnected ? 'MongoDB' : 'LocalPersistentStore',
  uri: isMongoConnected ? config.mongoUri : 'local://backend/data/enquiries.json'
});
