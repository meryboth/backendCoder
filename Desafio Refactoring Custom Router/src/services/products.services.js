/* import ProductModel from '../models/product.model.js';

class ProductService {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const queryOptions = query
      ? { name: { $regex: query, $options: 'i' } }
      : {};
    const sortOptions = sort ? { [sort]: 1 } : {};

    const options = {
      page,
      limit,
      sort: sortOptions,
      lean: true, 
    };

    return await ProductModel.paginate(queryOptions, options);
  }

  async getProductById(id) {
    const producto = await ProductModel.findById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async addProduct(productData) {
    const nuevoProducto = new ProductModel(productData);
    await nuevoProducto.save();
    return nuevoProducto;
  }

  async updateProduct(id, productData) {
    const productoActualizado = await ProductModel.findByIdAndUpdate(
      id,
      productData,
      { new: true }
    );
    if (!productoActualizado) {
      throw new Error('Producto no encontrado');
    }
    return productoActualizado;
  }

  async deleteProduct(id) {
    const productoEliminado = await ProductModel.findByIdAndDelete(id);
    if (!productoEliminado) {
      throw new Error('Producto no encontrado');
    }
    return productoEliminado;
  }
}

export default new ProductService();
 */

import DAOFactory from '../dao/daoFactory.js';
import config from '../config/config.js';

const dataSource = config.data_source || 'mongo'; // Utiliza mongo por defecto
const productDAO = DAOFactory.getDAO('product', dataSource);

class ProductService {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    return await productDAO.getAllProducts({ limit, page, sort, query });
  }

  async getProductById(id) {
    const producto = await productDAO.getProductById(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async addProduct(productData) {
    const nuevoProducto = await productDAO.createProduct(productData);
    return nuevoProducto;
  }

  async updateProduct(id, productData) {
    const productoActualizado = await productDAO.updateProduct(id, productData);
    if (!productoActualizado) {
      throw new Error('Producto no encontrado');
    }
    return productoActualizado;
  }

  async deleteProduct(id) {
    const productoEliminado = await productDAO.deleteProduct(id);
    if (!productoEliminado) {
      throw new Error('Producto no encontrado');
    }
    return productoEliminado;
  }
}

export default new ProductService();
