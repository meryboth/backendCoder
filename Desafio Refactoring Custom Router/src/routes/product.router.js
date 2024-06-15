import CustomRouter from './router.js';
import ProductService from '../services/products.services.js';
import { authenticateJWT, isAdmin } from '../middlewares/auth.js';

class ProductRouter extends CustomRouter {
  init() {
    this.get('/', this.getAllProducts);
    this.get('/:pid', this.getProductById);
    this.post('/', [authenticateJWT, isAdmin], this.addProduct);
    this.put('/:pid', [authenticateJWT, isAdmin], this.updateProduct);
    this.delete('/:pid', [authenticateJWT, isAdmin], this.deleteProduct);
  }

  async getAllProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const productos = await ProductService.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });

      res.json({
        status: 'success',
        payload: productos.docs,
        totalPages: productos.totalPages,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        page: productos.page,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevLink: productos.prevLink,
        nextLink: productos.nextLink,
      });
    } catch (error) {
      console.error(
        'An error occurred while attempting to retrieve the list of products:',
        error
      );
      res.status(500).send('Server error while querying.');
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;

    try {
      const producto = await ProductService.getProductById(id);
      if (!producto) {
        return res
          .status(404)
          .send('The product with the requested ID was not found.');
      }

      res.json(producto);
    } catch (error) {
      console.error('Error retrieving product:', error);
      res.status(500).send('Internal server error');
    }
  }

  async addProduct(req, res) {
    const nuevoProducto = req.body;

    try {
      console.log('Nuevo producto recibido:', nuevoProducto); // Depuración
      const createdProduct = await ProductService.addProduct(nuevoProducto);
      console.log('Producto creado:', createdProduct); // Depuración
      res
        .status(201)
        .json({
          message: 'The entered product was successfully added!',
          product: createdProduct,
        });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).send('Internal server error');
    }
  }

  async updateProduct(req, res) {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
      const updatedProduct = await ProductService.updateProduct(
        id,
        productoActualizado
      );
      res.json({
        message: 'The product was successfully edited!',
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Internal server error');
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;

    try {
      await ProductService.deleteProduct(id);
      res.json({ message: 'Product successfully deleted.' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal server error');
    }
  }
}

export default new ProductRouter().getRouter();
