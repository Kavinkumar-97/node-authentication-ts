import mongoose from 'mongoose';

const _ = mongoose.connect(process.env.MONGO_DB_URL);

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected Database');
});

db.on('error', (error) => {
  console.error('Failed to connect to the database:', error);
});

export default db;
