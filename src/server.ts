import { app } from './app';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const mongoURL = process.env.MONGO_CONNECTION_STRING;

if (!mongoURL) {
  console.error('MongoDB connection string is missing in environment variables!');
  process.exit(1);
}

mongoose
  .connect(mongoURL, {
  } as ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); 
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
