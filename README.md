## Ecommerce Backend Project

Este repositorio contiene el código del proyecto de ecommerce desarrollado durante un curso de backend en Coderhouse.

## Descripción

El proyecto de ecommerce es una plataforma que permite a los usuarios navegar, buscar y comprar productos en línea. Incluye funcionalidades de autenticación, autorización, gestión de productos, gestión de usuarios y carritos de compra.

- Autenticación y Autorización: Registro de usuarios, inicio de sesión y autenticación JWT.
- Gestión de Productos: Creación, lectura, actualización y eliminación de productos.
- Gestión de Usuarios: Administración de perfiles de usuario y roles (admin/usuario).
- Carrito de Compras: Añadir y eliminar productos del carrito, y realizar pedidos.

## Tecnologías Utilizadas

- Node JS
- Express JS
- MongoDB
- Mongoose
- Passport JWT
- ES6 Modules

## Tecnologías Utilizadas

```jsx
backendCoder/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── .env
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

## **Configuración del Proyecto**

### **Prerrequisitos**

- Node.js (v14 o superior)
- MongoDB

### **Instalación**

1. Clonar el repositorio:
    
    ```bash
    git clone https://github.com/meryboth/backendCoder.git
    cd backendCoder
    ```
    
2. Instalar dependencias:
    
    ```bash
    npm install
    ```
    
3. Configurar las variables de entorno:
Crear un archivo **`.env`** en la raíz del proyecto con las siguientes variables:
    
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/ecommerce
    JWT_SECRET=tu_secreto_jwt
    ```
    
4. Iniciar el servidor:
    
    ```bash
    npm start
    ```
    

## **Uso**

### **Endpoints**

- **Autenticación**
    - **`POST /api/auth/register`** - Registrar un nuevo usuario.
    - **`POST /api/auth/login`** - Iniciar sesión y obtener token JWT.
- **Productos**
    - **`GET /api/products`** - Obtener todos los productos.
    - **`GET /api/products/:id`** - Obtener un producto por ID.
    - **`POST /api/products`** - Crear un nuevo producto (solo admin).
    - **`PUT /api/products/:id`** - Actualizar un producto por ID (solo admin).
    - **`DELETE /api/products/:id`** - Eliminar un producto por ID (solo admin).
- **Usuarios**
    - **`GET /api/users`** - Obtener todos los usuarios (solo admin).
    - **`GET /api/users/:id`** - Obtener un usuario por ID.
    - **`PUT /api/users/:id`** - Actualizar un usuario por ID.
    - **`DELETE /api/users/:id`** - Eliminar un usuario por ID (solo admin).
- **Carrito de Compras**
    - **`GET /api/cart`** - Obtener el carrito de compras del usuario.
    - **`POST /api/cart`** - Añadir un producto al carrito.
    - **`DELETE /api/cart/:productId`** - Eliminar un producto del carrito.

## **Contribución**

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (**`git checkout -b feature/nueva-funcionalidad`**).
3. Realiza tus cambios y haz commit (**`git commit -m 'Añadir nueva funcionalidad'`**).
4. Haz push a la rama (**`git push origin feature/nueva-funcionalidad`**).
5. Abre un Pull Request.

## **Licencia**

Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.

## **Contacto**

Para cualquier pregunta o sugerencia, puedes contactarme en mbotheatoz@gmail.com.