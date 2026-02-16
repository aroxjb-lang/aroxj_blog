import mongoose from 'mongoose';

const URI =
  'mongodb+srv://Vercel-Admin-aroxj-blog:WOmJHTGSBMePrSOl@aroxj-blog.wcclts8.mongodb.net/aroxj-blog?retryWrites=true&w=majority&authSource=admin';

async function run() {
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('CONNECTED');
    process.exit(0);
  } catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
  }
}

run();
