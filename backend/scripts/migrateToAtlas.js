const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const localUri = 'mongodb://127.0.0.1:27017/portfolio_db';
const atlasUri = process.env.MONGODB_URI;

if (!atlasUri) {
  console.error('❌ MONGODB_URI is not defined in backend/.env');
  process.exit(1);
}

async function migrate() {
  console.log('==================================================');
  console.log('🚀 MIGRATION: Local MongoDB ➡️ MongoDB Atlas');
  console.log('==================================================');

  console.log('1. Connecting to Local MongoDB...');
  const localConn = await mongoose.createConnection(localUri).asPromise();
  console.log('✅ Connected to Local MongoDB!');

  console.log('2. Connecting to MongoDB Atlas...');
  const atlasConn = await mongoose.createConnection(atlasUri, { serverSelectionTimeoutMS: 15000 }).asPromise();
  console.log(`✅ Connected to MongoDB Atlas (${atlasConn.host}/${atlasConn.name})!`);

  const collections = await localConn.db.listCollections().toArray();
  console.log(`\nFound ${collections.length} collections to migrate:`);

  for (const col of collections) {
    const colName = col.name;
    const localCollection = localConn.db.collection(colName);
    const atlasCollection = atlasConn.db.collection(colName);

    const docs = await localCollection.find({}).toArray();
    console.log(`\n📦 Migrating [${colName}] (${docs.length} documents)...`);

    if (docs.length > 0) {
      // Clear atlas collection first to avoid duplicates
      await atlasCollection.deleteMany({});
      // Insert docs
      await atlasCollection.insertMany(docs);
      console.log(`   ✅ Successfully migrated ${docs.length} documents into Atlas [${colName}]`);
    } else {
      console.log(`   ℹ️ [${colName}] is empty, skipped.`);
    }
  }

  console.log('\n==================================================');
  console.log('🎉 ALL DATA HAS BEEN SUCCESSFULLY MIGRATED TO ATLAS!');
  console.log('==================================================');

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('\n❌ Migration Failed:', err.message);
  process.exit(1);
});
