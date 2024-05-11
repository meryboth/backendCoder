import express from 'express';
const router = express.Router();
import ProductManager from '../controllers/product-manager.js';
const productManager = new ProductManager();

/* Get all products */
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const productos = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    const paginationInfo = {
      totalPages: productos.totalPages,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.hasPrevPage
        ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: productos.hasNextPage
        ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}`
        : null,
    };

    res.json({
      status: 'success',
      payload: productos.docs,
      ...paginationInfo,
    });
  } catch (error) {
    console.error(
      'An error occurred while attempting to retrieve the list of products:',
      error
    );
    res.status(500).json({
      status: 'error',
      error: 'Server error while querying.',
    });
  }
});

/* Get only one product by ID */
router.get('/:pid', async (req, res) => {
  const id = req.params.pid;

  try {
    const producto = await productManager.getProductById(id);
    if (!producto) {
      return res.json({
        error: 'The product with the requested ID was not found.',
      });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error retrieving product', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/* Add new product */
router.post('/', async (req, res) => {
  const nuevoProducto = req.body;

  try {
    await productManager.addProduct(nuevoProducto);
    res.status(201).json({
      message: 'The entered product was successfully added!',
    });
  } catch (error) {
    console.error('Error adding product', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/* Update product by ID */
router.put('/:pid', async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await productManager.updateProduct(id, productoActualizado);
    res.json({
      message: 'The product was successfully edited!',
    });
  } catch (error) {
    console.error('Error updating product', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/* Delete product by ID */
router.delete('/:pid', async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProduct(id);
    res.json({
      message: 'Product successfully deleted.',
    });
  } catch (error) {
    console.error('Error deleting product', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
