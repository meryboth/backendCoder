import mongoose from 'mongoose';

/* Schema Definition */
const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  email: String,
  age: Number,
  country: String,
});
/* Model Definition */
const usersModel = new mongoose.model('usuarios', userSchema);

export default usersModel;
