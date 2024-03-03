const fs = require('fs');

class ProductManager {
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
}

// Testeo del código
(async () => {
  const productManager = new ProductManager(); // inicializa

  // Test Case 1: Se creará una instancia de la clase "ProductManager"
  console.log('Test Case 1: Instancia de ProductManager creada');

  // Test Case 2: Se llamará "getProducts" recién creada la instancia, debe devolver un arreglo vacío []
  const emptyProducts = await productManager.getProducts();
  if (Array.isArray(emptyProducts) && emptyProducts.length === 0) {
    console.log('Test Case 2: PASSED');
  } else {
    console.log('Test Case 2: FAILED');
  }

  // Test Case 3: Se llamará al método "addProduct" con los campos especificados
  const testProduct = new Product(
    'Producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
  );
  await productManager.addProduct(testProduct);

  // Test Case 4: Se llamará al método "getProducts" nuevamente, debe aparecer el producto recién agregado
  const productsAfterAdd = await productManager.getProducts();
  const addedProductFound = productsAfterAdd.some(
    (product) => product.id === testProduct.id
  );
  if (addedProductFound) {
    console.log('Test Case 4: PASSED');
  } else {
    console.log('Test Case 4: FAILED');
  }

  // Test Case 5: Se llamará al método "getProductById" y se corroborará que devuelva el producto con el id especificado
  try {
    const retrievedProduct = await productManager.getProductById(
      testProduct.id
    );
    if (retrievedProduct.id === testProduct.id) {
      console.log('Test Case 5: PASSED');
    } else {
      console.log('Test Case 5: FAILED');
    }
  } catch (error) {
    console.log('Test Case 5: FAILED - Error:', error.message);
  }

  // Test Case 6: Se llamará al método "updateProduct" y se intentará cambiar un campo de algún producto
  const updateData = { description: 'Nueva descripción' };
  await productManager.updateProduct(testProduct.id, updateData);
  const updatedProduct = await productManager.getProductById(testProduct.id);
  if (updatedProduct.description === updateData.description) {
    console.log('Test Case 6: PASSED');
  } else {
    console.log('Test Case 6: FAILED');
  }

  // Test Case 7: Se llamará al método "deleteProduct", se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir
  try {
    await productManager.deleteProduct(testProduct.id);
    const productsAfterDelete = await productManager.getProducts();
    const deletedProductFound = productsAfterDelete.some(
      (product) => product.id === testProduct.id
    );
    if (!deletedProductFound) {
      console.log('Test Case 7: PASSED');
    } else {
      console.log('Test Case 7: FAILED');
    }
  } catch (error) {
    console.log('Test Case 7: FAILED - Error:', error.message);
  }
})();
