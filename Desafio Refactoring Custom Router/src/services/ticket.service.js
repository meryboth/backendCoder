import DAOFactory from '../dao/daoFactory.js';
import config from '../config/config.js';
import TicketDAO from '../dao/models/ticketDAO.js';

const dataSource = config.data_source || 'mongo'; // Usa mongo por defecto
const cartDAO = DAOFactory.getDAO('carts', dataSource);

class TicketService {
  async purchaseCart(userEmail) {
    try {
      const cart = await cartDAO.getCartByUserEmail(userEmail);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const productsPurchased = [];
      const productsNotPurchased = [];
      let totalAmount = 0;

      for (let item of cart.products) {
        const product = item.product;
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
          totalAmount += product.price * item.quantity;
          productsPurchased.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            quantity: item.quantity,
          });
        } else {
          productsNotPurchased.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            requestedQuantity: item.quantity,
            availableStock: product.stock,
          });
        }
      }

      if (productsPurchased.length === 0) {
        throw new Error(
          'No products could be purchased due to insufficient stock'
        );
      }

      // Crear el ticket
      const ticketData = {
        amount: totalAmount,
        purchaser: userEmail, // Usar el correo del usuario
      };
      const ticket = await TicketDAO.createTicket(ticketData);

      // Filtrar los productos no comprados y actualizar el carrito
      cart.products = cart.products.filter(
        (item) =>
          !productsNotPurchased.some((p) => p.productId === item.product._id)
      );
      await cart.save();

      return {
        ticket,
        productsPurchased,
        productsNotPurchased,
      };
    } catch (error) {
      throw new Error('Error during purchase: ' + error.message);
    }
  }

  async getTicketById(id) {
    try {
      return await TicketDAO.getTicketById(id);
    } catch (error) {
      throw new Error('Error fetching ticket by ID: ' + error.message);
    }
  }

  async getAllTickets() {
    try {
      return await TicketDAO.getAllTickets();
    } catch (error) {
      throw new Error('Error fetching all tickets: ' + error.message);
    }
  }

  async deleteTicket(id) {
    try {
      return await TicketDAO.deleteTicket(id);
    } catch (error) {
      throw new Error('Error deleting ticket: ' + error.message);
    }
  }
}

export default new TicketService();
