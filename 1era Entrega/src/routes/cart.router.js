import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Ruta al archivo que contiene los datos del carrito
const cartFilePath = path.resolve('./src/cart.json');
// Ruta al archivo que contiene los datos de los productos
const productsFilePath = path.resolve('./src/products.json');

// Función para leer los datos de los productos desde el archivo
const readProductsFile = () => {
  try {
    const productsData = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(productsData);
  } catch (err) {
    console.error('Error al leer el archivo de productos:', err);
    return null;
  }
};

// Función para leer los datos del carrito desde el archivo
const readCartFile = () => {
  try {
    const cartData = fs.readFileSync(cartFilePath, 'utf-8');
    return JSON.parse(cartData);
  } catch (err) {
    console.error('Error al leer el archivo de carrito:', err);
    return null;
  }
};

// Función para escribir los datos del carrito en el archivo
const writeCartFile = (cart) => {
  try {
    fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2));
  } catch (err) {
    console.error('Error al escribir en el archivo de carrito:', err);
  }
};

// POST NEW CART
router.post('/api/cart', (req, res) => {
  // Crear un nuevo carrito con un ID único y un array de productos vacío
  const newCart = {
    id: uuidv4(),
    products: [],
  };

  // Escribir los datos del nuevo carrito en el archivo
  writeCartFile([newCart]); // Asegúrate de pasar el nuevo carrito en un array

  res.status(201).json(newCart);
});

// GET CART BY ID
router.get('/api/cart/:cid', (req, res) => {
  const { cid } = req.params;

  // Leer el carrito actual
  const cart = readCartFile();

  // Encontrar el carrito correspondiente al ID especificado
  const targetCart = cart.find((cartItem) => cartItem.id === cid);

  // Si el carrito no existe, devolver un error 404
  if (!targetCart) {
    return res.status(404).send('El carrito especificado no existe.');
  }

  res.json(targetCart.products);
});

// POST ADD PRODUCT TO CART
router.post('/api/cart/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;

  // Validar que la cantidad sea un número entero positivo
  const quantity = 1; // Agregamos uno por defecto
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res
      .status(400)
      .send('La cantidad debe ser un número entero positivo.');
  }

  // Leer el carrito actual
  const cart = readCartFile();

  // Encontrar el carrito correspondiente al ID especificado
  const targetCart = cart.find((cartItem) => cartItem.id === cid);

  // Si el carrito no existe, devolver un error 404
  if (!targetCart) {
    return res.status(404).send('El carrito especificado no existe.');
  }

  // Leer los productos disponibles
  const products = readProductsFile();

  // Verificar si el producto existe en los productos disponibles
  const productToAdd = products.find((product) => product.id === pid);
  if (!productToAdd) {
    return res.status(404).send('El producto especificado no existe.');
  }

  // Encontrar el producto en el carrito
  const productInCart = targetCart.products.find(
    (product) => product.id === pid
  );

  if (productInCart) {
    // Si el producto ya está en el carrito, actualizar la cantidad
    productInCart.quantity += quantity;
  } else {
    // Si el producto no está en el carrito, agregarlo con la cantidad especificada
    targetCart.products.push({
      ...productToAdd,
      quantity,
    });
  }

  // Escribir los datos del carrito actualizados en el archivo
  writeCartFile(cart);

  // Devolver el carrito actualizado como respuesta
  res.json(targetCart.products);
});

export default router;
