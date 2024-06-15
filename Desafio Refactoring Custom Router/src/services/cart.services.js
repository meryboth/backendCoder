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
