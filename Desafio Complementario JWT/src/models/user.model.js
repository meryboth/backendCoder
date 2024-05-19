import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    age: {
      type: Number,
      // required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts',
      required: false,
    },
  },
  { collection: 'users' }
); // Especificar el nombre de la colección

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
