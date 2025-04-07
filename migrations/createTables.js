const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
async function up() {
  try {
    const userSchema = new mongoose.Schema({
      name: { type: String, require: true, minlength: 3 },
      surname: {  type: String, required: true, minlength: 3 },
      email: {type: String, require: true, unique: true, match: /.+\@.+\..+/},
      password: {type: String, require: true, minlength: 6},
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      
    }, {timestamps: true});
   
    
    const User = mongoose.model('User', userSchema);
    console.log('User collection is ready');
  } catch (error) {
    console.log(error);
    
  }
}

async function init() {
  try {
    
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await up();
    
    await mongoose.disconnect();
    console.log('Successfully created all collections ...');
    process.exit(0);
  } catch (error) {
    console.log(error);
    
    process.exit(1);
  }
}

init();
