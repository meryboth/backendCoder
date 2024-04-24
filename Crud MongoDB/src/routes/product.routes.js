import express from 'express';
const router = express.Router();
import ProductModel from '../models/product.model';

router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find();
    console.log(products);
    res.render('products', { products });
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});
