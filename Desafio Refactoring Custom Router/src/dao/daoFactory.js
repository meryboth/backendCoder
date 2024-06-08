import UserDAO from './models/userDAO.js';
import ProductDAO from './models/productDAO.js';
import CartDAO from './models/cartDAO.js';

class DAOFactory {
  static getDAO(entity, dataSource = 'mongo') {
    switch (entity) {
      case 'user':
        return new UserDAO(dataSource);
      case 'product':
        return new ProductDAO(dataSource);
      case 'cart':
        return new CartDAO(dataSource);
      default:
        throw new Error('Unknown entity type');
    }
  }
}

export default DAOFactory;
