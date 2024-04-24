import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
});

const CartModel = mongoose.model('cart', cartSchema);

export default CartModel;
