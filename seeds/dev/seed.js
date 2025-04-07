
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// import config from '../../src/config/variables.config';

// const { ADMIN_PASSWORD } = config;
const dotenv = require('dotenv');
dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  surname: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  await User.create({
    name: 'Admin',
    surname: 'User',
    email: 'admin@example.com',
    password: await bcrypt.hash("Admin123", 10),
    role: 'admin'
  });
}

async function init() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await seed();
    console.log('Successfully inserted all data ...');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
  }
}

init();
