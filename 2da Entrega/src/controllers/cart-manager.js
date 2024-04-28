import CartModel from '../models/cart.model.js';

class CartManager {
  async newCart(products) {
    try {
      const nuevoCarrito = new CartModel({ products });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.log('Error creating the new cart:', error);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const carrito = await CartModel.findById(cartId);
      if (!carrito) {
        console.log('No cart found with the provided ID.');
        return null;
      }
      return carrito;
    } catch (error) {
      console.log('Error fetching cart products', error);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.getCartById(cartId);
      const indexProducto = carrito.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (indexProducto !== -1) {
        // Si el producto ya está en el carrito, actualiza la cantidad
        carrito.products[indexProducto].quantity += quantity;
      } else {
        // Si el producto no está en el carrito, agrégalo como un nuevo objeto
        carrito.products.push({ product: productId, quantity });
      }

      // Marca el campo products como modificado para que se guarde correctamente
      carrito.markModified('products');

      // Guarda los cambios en el carrito
      await carrito.save();
      return carrito;
    } catch (error) {
      console.log('Error adding new product to your cart:', error);
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error('Cart was not found');
      }

      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );

      await cart.save();
      return cart;
    } catch (error) {
      console.error('Error deleting the product from the cart.', error);
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error('Cart not found.');
      }

      cart.products = updatedProducts;

      cart.markModified('products');

      await cart.save();

      return cart;
    } catch (error) {
      console.error('Error updating the content of the cart:', error);
      throw error;
    }
  }

  async updateQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error('Cart not found');
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;

        cart.markModified('products');

        await cart.save();
        return cart;
      } else {
        throw new Error('The product was not found inside the cart.');
      }
    } catch (error) {
      console.error(
        'Error updating the quantity of this product inside the cart.',
        error
      );
      throw error;
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );

      if (!cart) {
        throw new Error('Cart not found.');
      }

      return cart;
    } catch (error) {
      console.error('Error trying to delete the content of the cart:', error);
      throw error;
    }
  }
}

export default CartManager;
