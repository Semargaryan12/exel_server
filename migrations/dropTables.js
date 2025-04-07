const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
async function down() {
  try {
    await mongoose.connection.dropCollection('User');
    console.log('Successfully dropped users collection ...');
  } catch (error) {
    if (error.code === 26) {
      console.log('Users collection does not exist, skipping drop.');
    } else {
      console.log(error);
      
    }
  }
}

async function init() {
  try {
    
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await down();
    
    await mongoose.disconnect();
    console.log('Successfully cleaned up database ...');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
