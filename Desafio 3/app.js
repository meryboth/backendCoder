/* Módulos importados */
const fs = require('fs');
const express = require('express');
/* Puerto */
const PORT = 8080;
/* Creación del servidor */
const app = express();
// Lee el archivo products.json
const productsData = fs.readFileSync('./products.json', 'utf-8');
// Convierte el contenido del archivo a un objeto JavaScript
const products = JSON.parse(productsData);

// Usa los datos del producto en tu aplicación

app.get('/', (req, res) => {
  res.end('Bienvenido a la tienda!');
});

// Ruta para obtener productos con límite opcional
app.get('/products', (req, res) => {
  const limit = parseInt(req.query.limit); // Obtener el límite de la consulta
  let productsToSend = products; // Por defecto, enviar todos los productos

  if (limit && !isNaN(limit)) {
    // Si se proporciona un límite válido en la consulta
    productsToSend = products.slice(0, limit); // Limitar productos según el límite
  }

  res.json(productsToSend);
});

app.get('/products/:id', (req, res) => {
  let id = req.params.id;

  const product = products.find((producto) => producto.id == id);

  if (product) {
    res.send(product);
  } else {
    res.send('Cannont find the product.');
  }
});

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto: http://localhost:${PORT}`);
});

/* class ProductManager {
  constructor() {
    this.products = [];
    this.path = './products.json'; // Ruta del archivo JSON
    // Verifica si el archivo products.json existe, si no, lo crea e inicializa
    this.initializeProductsFile();
  }

  async initializeProductsFile() {
    try {
      await fs.access(this.path); // Verifica si el archivo existe
    } catch (err) {
      // El archivo no existe, entonces lo crea e inicializa
      await writeProductsFile(this.path, this.products);
    }
  }

  // Método para agregar un nuevo producto
  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error(
        'Recuerda completar los campos, todos los campos son obligatorios para crear un producto nuevo.'
      );
    }
    if (this.products.some((product) => product.code === code)) {
      throw new Error('El código del producto ya existe.');
    }
    this.products.push(product);
    await writeProductsFile(this.path, this.products);
    console.log('Producto agregado exitosamente.', product);
  }

  // Método para obtener todos los productos
  async getProducts() {
    if (!fs.existsSync(this.path)) {
      return console.log('No se encontró el archivo products.json');
    }
    const products = await readProductsFile(this.path);
    console.log('Los productos que se encuentran actualmente son:', products);
    return products;
  }

  // Método para obtener un producto por su ID
  async getProductById(id) {
    const products = await readProductsFile(this.path);
    const productIndex = findProductIndexById(products, id);
    // Si el producto no se encuentra, lanza un error
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    console.log('El producto consultado es:', products[productIndex]);
    return products[productIndex];
  }

  // Método para eliminar un producto por su ID
  async deleteProduct(id) {
    const products = await readProductsFile(this.path);
    const productIndex = findProductIndexById(products, id);
    // Si el producto no se encuentra, lanza un error
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    // Elimina el producto de la lista y actualiza el archivo
    products.splice(productIndex, 1);
    await writeProductsFile(this.path, products);
    console.log(`Producto con ID ${id} eliminado exitosamente.`);
  }

  // Método para actualizar un producto por su ID
  async updateProduct(id, updatedData) {
    const products = await readProductsFile(this.path);
    const productIndex = findProductIndexById(products, id);
    // Si el producto no se encuentra, lanza un error
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }
    // Verifica si se está intentando actualizar el ID del producto
    if (updatedData.hasOwnProperty('id')) {
      throw new Error('No se puede actualizar el ID del producto');
    }
    // Actualiza los datos del producto y escribe en el archivo
    products[productIndex] = { ...products[productIndex], ...updatedData };
    await writeProductsFile(this.path, products);
    console.log(`Producto con ID ${id} actualizado exitosamente.`);
  }
}

// Función para leer los productos desde el archivo
async function readProductsFile(path) {
  try {
    const jsonData = await fs.promises.readFile(path, 'utf-8');
    const products = JSON.parse(jsonData);
    console.log(products);
    return products;
  } catch (err) {
    console.error('Error al leer el archivo products.json:', err);
    throw new Error('No se pudo leer el archivo products.json');
  }
}

// Función para escribir los productos en el archivo
async function writeProductsFile(path, products) {
  try {
    const jsonData = JSON.stringify(products, null, 2);
    await fs.promises.writeFile(path, jsonData);
  } catch (err) {
    console.error('Error al escribir el archivo products.json:', err);
    throw new Error('No se pudo escribir el archivo products.json');
  }
}

// Función para encontrar el índice de un producto por su ID
function findProductIndexById(products, id) {
  return products.findIndex((product) => product.id === id);
}

class Product {
  static idCounter = 1;
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.idCounter++; // Asigna un ID único al producto
  }
} */
