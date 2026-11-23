import mongoose from 'mongoose';
import { config } from './environment';

let isMongoConnected = false;

// Helper to mask credentials in connection URI for secure logging
export const maskMongoUri = (uri: string): string => {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

export const connectDatabase = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB connected at: ${maskMongoUri(config.mongoUri)}`);
    return true;
  } catch (err: any) {
    isMongoConnected = false;
    console.warn(
      `[Database] Notice: MongoDB connection failed (${err.message || 'connection timeout'}). Using persistent local JSON datastore.`
    );
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isMongoConnected,
  type: isMongoConnected ? 'MongoDB' : 'LocalPersistentStore',
  uri: isMongoConnected ? maskMongoUri(config.mongoUri) : 'local://backend/data/enquiries.json'
});
