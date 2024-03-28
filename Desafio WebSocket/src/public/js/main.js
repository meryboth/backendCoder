const socket = io();

socket.on('productos', (data) => {
  renderProductos(data);
});

//Función para renderizar el listado de productos

/* const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `
                            <p> ID: ${item.id} </p>
                            <p> Titulo:  ${item.title} </p>
                            <p> Precio: ${item.price} </p>
                            <button> Eliminar producto </button>
                        `;
        contenedorProductos.appendChild(card);
    
        //Agregamos el evento al boton de eliminar producto: 
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id)
        }) 
    })
}
 */

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById('product-list'); // Cambiado a "product-list"
  contenedorProductos.innerHTML = '';

  productos.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add(
      'card',
      'shadow-md',
      'rounded-lg',
      'max-w-sm',
      'mx-3',
      'my-3',
      'p-5',
      'bg-slate-100'
    ); // Agregando clases CSS
    card.innerHTML = `
            <h3 class="text-gray-900 font-bold text-xl tracking-tight">${item.title}</h3>
            <p class="text-gray-500 text-s">${item.description}</p>
            <div class="flex flex-row justify-between items-center mt-5">
                <p class="text-gray-900 font-bold text-xl">$${item.price}</p>
                <button class="btn-delete bg-red-500 text-white rounded-lg p-3" data-product-id="${item.id}">Eliminar</button>
            </div>
        `;
    contenedorProductos.appendChild(card);

    //Agregamos el evento al boton de eliminar producto:
    card.querySelector('button').addEventListener('click', () => {
      eliminarProducto(item.id);
    });
  });
};

//Eliminar producto:

const eliminarProducto = (id) => {
  socket.emit('eliminarProducto', id);
};

//Agregar producto:

document.getElementById('btnEnviar').addEventListener('click', () => {
  agregarProducto();
});

const agregarProducto = () => {
  const producto = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    img: document.getElementById('img').value,
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
    category: document.getElementById('category').value,
    status: document.getElementById('status').value === 'true',
  };
  socket.emit('agregarProducto', producto);
};
