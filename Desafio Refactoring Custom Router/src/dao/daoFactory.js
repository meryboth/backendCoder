import UserDAO from './models/userDAO.js';
import ProductDAO from './models/productDAO.js';
// Importar otros DAOs según sea necesario

class DAOFactory {
  static getDAO(entity, dataSource = 'mongo') {
    switch (entity) {
      case 'user':
        return new UserDAO(dataSource);
      case 'product':
        return new ProductDAO(dataSource);
      // Añadir casos para otros DAOs aquí...
      default:
        throw new Error('Unknown entity type');
    }
  }
}

export default DAOFactory;
