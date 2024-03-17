import express from 'express';
import fs from 'fs';
import path from 'path';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';

// Lee el archivo products.json

// Obtén la ruta al archivo products.json
const filePath = path.resolve('./src/products.json');
// Lee el archivo
const productsData = fs.readFileSync(filePath, 'utf-8');
// Convierte el contenido del archivo a un objeto JavaScript
const products = JSON.parse(productsData);

//GET PRODUCTS
router.get('/api/products', (req, res) => {
  /* Envia el limit de productos especificados en el query */
  const limit = parseInt(req.query.limit);
  let productsToSend = products;
  if (limit && !isNaN(limit)) {
    productsToSend = products.slice(0, limit);
  }

  res.send(productsToSend);
});

// GET PRODUCTS BY ID

router.get('/api/products/:id', (req, res) => {
  let id = req.params.id;
  const product = products.find((producto) => producto.id == id);
  if (product) {
    res.send(product);
  } else {
    res.send('Cannont find the product.');
  }
});

// POST NEW PRODUCT
router.post('/api/products', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails, // Esto es opcional
  } = req.body;

  // Validar que todos los campos obligatorios estén presentes
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  // Generar un nuevo ID para el producto usando uuid
  const id = uuidv4();

  // Crear el nuevo producto
  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status: true, // Valor por defecto
    stock,
    category,
    thumbnails: thumbnails || '', // Si no se proporciona, se establece como una cadena vacía
  };

  // Agregar el nuevo producto al arreglo de productos
  products.push(newProduct);

  // Escribir el arreglo actualizado de productos en el archivo JSON
  fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error al agregar el producto.');
    }
    // Enviar una respuesta al cliente indicando que el producto se ha creado con éxito
    res.status(201).send('Producto creado exitosamente.');
  });
});

// PUT, UPDATE PRODUCT BY ID
router.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails, // Esto es opcional
  } = req.body;

  // Buscar el producto por su ID
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex === -1) {
    return res.status(404).send('Producto no encontrado.');
  }

  // Actualizar los campos del producto
  const updatedProduct = {
    ...products[productIndex],
    title: title || products[productIndex].title,
    description: description || products[productIndex].description,
    code: code || products[productIndex].code,
    price: price || products[productIndex].price,
    stock: stock || products[productIndex].stock,
    category: category || products[productIndex].category,
    thumbnails: thumbnails || products[productIndex].thumbnails,
  };

  // Asegurarse de que el ID del producto no cambie
  updatedProduct.id = productId;

  // Reemplazar el producto antiguo con el actualizado
  products[productIndex] = updatedProduct;

  // Escribir el arreglo actualizado de productos en el archivo JSON
  fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error al actualizar el producto.');
    }
    // Enviar una respuesta al cliente indicando que el producto se ha actualizado con éxito
    res.status(200).send('Producto actualizado exitosamente.');
  });
});

// DELETE PRODUCT BY ID
router.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;

  // Buscar el índice del producto por su ID
  const productIndex = products.findIndex(
    (product) => product.id === productId
  );
  if (productIndex === -1) {
    return res.status(404).send('Producto no encontrado.');
  }

  // Eliminar el producto del arreglo
  products.splice(productIndex, 1);

  // Escribir el arreglo actualizado de productos en el archivo JSON
  fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error al eliminar el producto.');
    }
    // Enviar una respuesta al cliente indicando que el producto se ha eliminado con éxito
    res.status(200).send('Producto eliminado exitosamente.');
  });
});

/* Exportamos */
export default router;
