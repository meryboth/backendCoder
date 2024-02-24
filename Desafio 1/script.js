class ProductManager {
  constructor() {
    this.products = [];
    this.id = 1;
  }
  /* Agrega un nuevo producto al gestor de productos. */
  addProduct(title, description, price, thumbnail, code, stock) {
    // Valida que los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error(
        'Recuerda completar los campos, todos los campos son obligatorios para crear un producto nuevo.'
      );
    }
    // Valida que code no se repita
    if (this.products.some((product) => product.code === code)) {
      throw new Error('El código del producto ya existe.');
    }
    // Crear un nuevo producto y suma el ID autoincrementable
    const product = new Producto(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      this.id++
    );
    this.products.push(product);
  }
  /* Permite consultar la cantidad de productos agregados */
  getProducts() {
    // Devuelve el array con sus productos
    return this.products;
  }
  /* Permite buscar un producto específico utilizando como parámetro un id */
  getProductById(id) {
    // Busca el producto por id y si no lo encuentra devuelve error:
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }
}

class Producto {
  constructor(title, description, price, thumbnail, code, stock, id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = id;
  }
}

/* TESTING: */

// Función de prueba para verificar si se crea una instancia de ProductManager
function testCreateProductManagerInstance() {
  const productManager = new ProductManager();
  console.log(
    productManager instanceof ProductManager
      ? 'Test de instancia de ProductManager: PASSED'
      : 'Test de instancia de ProductManager: FAILED'
  );
}

// Función de prueba para verificar si getProducts devuelve un array vacío inicialmente
function testGetProductsEmpty() {
  const productManager = new ProductManager();
  const products = productManager.getProducts();
  console.log(
    products.length === 0
      ? 'Test de getProducts vacío: PASSED'
      : 'Test de getProducts vacío: FAILED'
  );
}

// Función de prueba para verificar si addProduct agrega un producto correctamente
function testAddProduct() {
  const productManager = new ProductManager();
  productManager.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
  );
  const products = productManager.getProducts();
  console.log(
    products.length === 1 && products[0].title === 'producto prueba'
      ? 'Test de addProduct: PASSED'
      : 'Test de addProduct: FAILED'
  );
}

// Función de prueba para verificar si addProduct arroja un error al agregar un producto con un código repetido
function testAddProductDuplicateCode() {
  const productManager = new ProductManager();
  productManager.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
  );

  try {
    productManager.addProduct(
      'producto prueba 2',
      'Este es otro producto prueba',
      250,
      'Sin imagen',
      'abc123',
      30
    );
    console.log('Test de addProduct con código repetido: FAILED');
  } catch (error) {
    console.log(
      error.message === 'El código del producto ya existe.'
        ? 'Test de addProduct con código repetido: PASSED'
        : 'Test de addProduct con código repetido: FAILED'
    );
  }
}

// Función de prueba para verificar si getProductById devuelve el producto correcto
function testGetProductById() {
  const productManager = new ProductManager();
  productManager.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
  );

  const product = productManager.getProductById(1);
  console.log(
    product.title === 'producto prueba'
      ? 'Test de getProductById: PASSED'
      : 'Test de getProductById: FAILED'
  );
}

// Función de prueba para verificar si getProductById arroja un error si no encuentra el producto
function testGetProductByIdError() {
  const productManager = new ProductManager();

  try {
    productManager.getProductById(999);
    console.log('Test de getProductById con error: FAILED');
  } catch (error) {
    console.log(
      error.message === 'Producto no encontrado'
        ? 'Test de getProductById con error: PASSED'
        : 'Test de getProductById con error: FAILED'
    );
  }
}

// Ejecución de las pruebas
testCreateProductManagerInstance();
testGetProductsEmpty();
testAddProduct();
testAddProductDuplicateCode();
testGetProductById();
testGetProductByIdError();
