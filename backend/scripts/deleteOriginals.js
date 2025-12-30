// deleteOriginals.js
const mongoose = require('mongoose');
const Article = require('./models/Article');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beyondchats');
  const result = await Article.deleteMany({ isOptimized: false });
  console.log('Deleted originals:', result.deletedCount);
  await mongoose.disconnect();
}

run();
