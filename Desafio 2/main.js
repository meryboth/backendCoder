const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
    this.path = './products.json'; // Ruta del archivo JSON
  }

  // Método para agregar un nuevo producto
  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    // Verifica si todos los campos obligatorios están presentes
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error(
        'Recuerda completar los campos, todos los campos son obligatorios para crear un producto nuevo.'
      );
    }
    // Verifica si el código del producto ya existe
    if (this.products.some((product) => product.code === code)) {
      throw new Error('El código del producto ya existe.');
    }
    // Agrega el producto a la lista de productos y escribe en el archivo
    this.products.push(product);
    await writeProductsFile(this.path, this.products);
  }

  // Método para obtener todos los productos
  async getProducts() {
    // Lee los productos del archivo y los muestra en la consola
    const products = await readProductsFile(this.path);
    console.log(products);
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
    console.log(products[productIndex]);
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
    return JSON.parse(jsonData);
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
}

// Testeo del código
(async () => {
  const productManager = new ProductManager();
  const product = new Product(
    'Campera',
    'Descripcion',
    2000,
    '78367834',
    10,
    2
  );
  const product2 = new Product(
    'Campera',
    'Descripcion',
    2000,
    '78367834',
    11,
    2
  );
  await productManager.addProduct(product);
  await productManager.addProduct(product2);
  await productManager.getProducts();
  await productManager.getProductById(1);
  await productManager.deleteProduct(1);
})();
