// services/cart.service.js
/* import CartModel from '../models/cart.model.js';

class CartService {
  async createCart(products) {
    const nuevoCarrito = new CartModel({ products });
    await nuevoCarrito.save();
    return nuevoCarrito;
  }

  async getCart(cartId) {
    const carrito = await CartModel.findById(cartId);
    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }
    return carrito;
  }

  async addProductToCart(cartId, productId, quantity) {
    const carrito = await CartModel.findById(cartId);
    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    const productIndex = carrito.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex > -1) {
      carrito.products[productIndex].quantity += quantity;
    } else {
      carrito.products.push({ productId, quantity });
    }

    await carrito.save();
    return carrito;
  }

  async deleteProductFromCart(cartId, productId) {
    const carrito = await CartModel.findById(cartId);
    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    carrito.products = carrito.products.filter(
      (product) => product.productId.toString() !== productId
    );

    await carrito.save();
    return carrito;
  }

  async updateCart(cartId, updatedProducts) {
    const carrito = await CartModel.findById(cartId);
    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    carrito.products = updatedProducts;
    await carrito.save();
    return carrito;
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    const carrito = await CartModel.findById(cartId);
    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    const productIndex = carrito.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex > -1) {
      carrito.products[productIndex].quantity = newQuantity;
    } else {
      throw new Error('Producto no encontrado en el carrito');
    }

    await carrito.save();
    return carrito;
  }

  async emptyCart(cartId) {
    const carrito = await CartModel.findById(cartId);
    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    carrito.products = [];
    await carrito.save();
    return carrito;
  }
}

export default new CartService();
 */

import DAOFactory from '../dao/daoFactory.js';
import config from '../config/config.js';

const dataSource = config.data_source || 'mongo'; // Usa mongo por defecto
const cartDAO = DAOFactory.getDAO('carts', dataSource);

class CartService {
  async createCart(products) {
    return await cartDAO.createCart(products);
  }

  async getCart(cartId) {
    return await cartDAO.getCartById(cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    return await cartDAO.addProductToCart(cartId, productId, quantity);
  }

  async deleteProductFromCart(cartId, productId) {
    return await cartDAO.deleteProductFromCart(cartId, productId);
  }

  async updateCart(cartId, updatedProducts) {
    return await cartDAO.updateCart(cartId, updatedProducts);
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    return await cartDAO.updateQuantity(cartId, productId, newQuantity);
  }

  async emptyCart(cartId) {
    return await cartDAO.emptyCart(cartId);
  }
}

export default new CartService();
