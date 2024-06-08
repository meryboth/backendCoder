import CustomRouter from './router.js';
import ProductService from '../services/products.services.js';

class ProductRouter extends CustomRouter {
  init() {
    this.get('/', this.getAllProducts);
    this.get('/:pid', this.getProductById);
    this.post('/', this.addProduct);
    this.put('/:pid', this.updateProduct);
    this.delete('/:pid', this.deleteProduct);
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
      res.sendServerError('Server error while querying.');
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;

    try {
      const producto = await ProductService.getProductById(id);
      if (!producto) {
        return res.sendUserError(
          'The product with the requested ID was not found.'
        );
      }

      res.json(producto);
    } catch (error) {
      console.error('Error retrieving product', error);
      res.sendServerError('Internal server error');
    }
  }

  async addProduct(req, res) {
    const nuevoProducto = req.body;

    try {
      await ProductService.addProduct(nuevoProducto);
      res
        .status(201)
        .json({ message: 'The entered product was successfully added!' });
    } catch (error) {
      console.error('Error adding product', error);
      res.sendServerError('Internal server error');
    }
  }

  async updateProduct(req, res) {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
      await ProductService.updateProduct(id, productoActualizado);
      res.json({ message: 'The product was successfully edited!' });
    } catch (error) {
      console.error('Error updating product', error);
      res.sendServerError('Internal server error');
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;

    try {
      await ProductService.deleteProduct(id);
      res.json({ message: 'Product successfully deleted.' });
    } catch (error) {
      console.error('Error deleting product', error);
      res.sendServerError('Internal server error');
    }
  }
}

export default new ProductRouter().getRouter();
