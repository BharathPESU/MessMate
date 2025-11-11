import https from 'https';
import mongoose from 'mongoose';

const RETRY_BASE_DELAY_MS = Number(process.env.MONGO_RETRY_DELAY_MS || 5000);
const RETRY_MAX_DELAY_MS = Number(process.env.MONGO_MAX_RETRY_DELAY_MS || 60000);
const SERVER_SELECTION_TIMEOUT_MS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000);
const HEARTBEAT_FREQUENCY_MS = Number(process.env.MONGO_HEARTBEAT_MS || 10000);

let connectingPromise;
let whitelistHintShown = false;
let isConnecting = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPublicIp = () =>
  new Promise((resolve) => {
    const request = https.get('https://api.ipify.org?format=json', (response) => {
      let rawData = '';

      response.on('data', (chunk) => {
        rawData += chunk;
      });

      response.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve(parsed?.ip || null);
        } catch (error) {
          console.warn(`⚠️  Unable to parse public IP response: ${error.message}`);
          resolve(null);
        }
      });
    });

    request.on('error', (error) => {
      console.warn(`⚠️  Unable to determine public IP automatically: ${error.message}`);
      resolve(null);
    });

    request.setTimeout(5000, () => {
      request.destroy();
      resolve(null);
    });
  });

const logWhitelistHelp = async () => {
  if (whitelistHintShown) {
    return;
  }

  whitelistHintShown = true;
  const publicIp = await fetchPublicIp();
  if (publicIp) {
    console.info(`👉 Add ${publicIp}/32 to MongoDB Atlas Network Access or temporarily allow 0.0.0.0/0 while developing.`);
  } else {
    console.info('👉 Update MongoDB Atlas Network Access to include your current IP.');
  }
  console.info('ℹ️  Manage allowed IPs at https://www.mongodb.com/docs/atlas/security-whitelist/');
};

const connectWithRetry = async () => {
  let attempt = 0;

  isConnecting = true;

  while (true) {
    attempt += 1;
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
        heartbeatFrequencyMS: HEARTBEAT_FREQUENCY_MS,
      });

      const host = conn?.connection?.host || conn?.connection?.client?.s?.options?.srvHost || 'unknown-host';
      const dbName = conn?.connection?.name || conn?.connections?.[0]?.name || 'unknown-database';

      console.log(`✅ MongoDB Atlas Connected: ${host}`);
      console.log(`📦 Database: ${dbName}`);

      if (attempt > 1) {
        console.log(`🟢 MongoDB connection recovered after ${attempt} attempt(s).`);
      }

      isConnecting = false;
      return conn;
    } catch (error) {
      const cleanedMessage = error?.message || 'Unknown error';
      console.error(`❌ MongoDB Connection Error (attempt ${attempt}): ${cleanedMessage}`);

      if (cleanedMessage.toLowerCase().includes('whitelist')) {
        await logWhitelistHelp();
      }

      const delay = Math.min(RETRY_BASE_DELAY_MS * attempt, RETRY_MAX_DELAY_MS);
      console.log(`⏳ Retrying MongoDB connection in ${delay / 1000} seconds...`);
      await sleep(delay);
    }
  }
};

const connectDB = async () => {
  if (!connectingPromise) {
    connectingPromise = connectWithRetry();
  }

  return connectingPromise;
};

mongoose.connection.on('connected', () => {
  const { host, name } = mongoose.connection;
  console.log(`🟢 MongoDB connection established (${host || 'unknown-host'}/${name || 'unknown-database'}).`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — attempting to reconnect...');
  if (!isConnecting) {
    connectingPromise = null;
    connectDB().catch((error) => {
      console.error(`❌ MongoDB reconnection failed: ${error.message}`);
    });
  }
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

export default connectDB;
