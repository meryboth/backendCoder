import express from 'express';
const router = express.Router();

import ProductManager from '../controllers/product-manager.js';
const productManager = new ProductManager('./src/data/products.json');

//Routes
router.get('/', async (req, res) => {
  try {
    const productsStock = await productManager.getProducts();
    res.render('home', { productsStock: productsStock });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Realtime products route
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products: products });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
