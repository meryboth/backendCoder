import express from 'express';
const router = express.Router();
import ProductModel from '../models/product.model.js';
import CartManager from '../controllers/cart-manager.js';
const cartManager = new CartManager();
import paginate from 'mongoose-paginate-v2';

router.get('/', async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = parseInt(req.query.limit) || 10;
    const productos = await ProductModel.paginate({}, { limit, page });
    const productosMap = productos.docs.map((producto) => {
      const { _id, ...rest } = producto.toObject();
      return rest;
    });

    res.render('products', {
      productos: productosMap.slice(0, limit),
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      currentPage: productos.page,
      prevPage: productos.prevPage,
      nextPage: productos.nextPage,
      totalPage: productos.totalPages,
    });
  } catch (error) {
    console.error('Failed to fetch products', error);
    res.status(500).json({
      error: 'Internal Server Error. Failed to fetch products.',
    });
  }
});

router.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await cartManager.getCartById(cartId);

    if (!carrito) {
      console.log('No cart found with the provided ID.');
      return res.status(404).json({ error: 'Cart not found.' });
    }

    const productosEnCarrito = carrito.products.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));

    res.render('carts', { productos: productosEnCarrito });
  } catch (error) {
    console.error('Error fetching products', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error. Failed to fetch cart.' });
  }
});

export default router;
