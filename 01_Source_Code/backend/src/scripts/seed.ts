import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { EnquiryModel } from '../models/enquiry.model';
import { config } from '../config/environment';

const DEFAULT_DATA_PATH = path.resolve(__dirname, '../data/defaultEnquiries.json');
const PERSISTENT_DATA_PATH = path.resolve(__dirname, '../../data/enquiries.json');

async function runSeed() {
  console.log('[Seed] Loading default sample enquiries...');
  const rawData = fs.readFileSync(DEFAULT_DATA_PATH, 'utf-8');
  const sampleEnquiries = JSON.parse(rawData);

  // Check if MongoDB is connected or can be connected
  let mongoConnected = false;
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 2000 });
    mongoConnected = true;
    console.log('[Seed] Connected to MongoDB. Seeding database collection...');

    await EnquiryModel.deleteMany({});
    const docs = sampleEnquiries.map((e: any) => {
      const { _id, ...rest } = e;
      return rest;
    });
    await EnquiryModel.insertMany(docs);
    console.log(`[Seed] Successfully inserted ${docs.length} enquiries into MongoDB!`);
    await mongoose.disconnect();
  } catch (err: any) {
    console.log(`[Seed] MongoDB not available (${err.message}). Seeding local JSON data file...`);
  }

  // Also write to local persistent data file
  fs.mkdirSync(path.dirname(PERSISTENT_DATA_PATH), { recursive: true });
  fs.writeFileSync(PERSISTENT_DATA_PATH, JSON.stringify(sampleEnquiries, null, 2), 'utf-8');
  console.log(`[Seed] Written ${sampleEnquiries.length} sample records to ${PERSISTENT_DATA_PATH}`);
  console.log('[Seed] Seeding completed successfully!');
}

runSeed()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
