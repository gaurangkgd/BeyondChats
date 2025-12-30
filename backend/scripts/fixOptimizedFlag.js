// fixOptimizedFlag.js
const mongoose = require('mongoose');
const Article = require('./models/Article');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beyondchats');
  const result = await Article.updateMany(
    { title: /\(Optimized\)/i },
    { $set: { isOptimized: true } }
  );
  console.log('Updated:', result.modifiedCount);
  await mongoose.disconnect();
}

run();