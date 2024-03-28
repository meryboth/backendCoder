const socket = io();

// Emit message to server
socket.emit('mensaje', 'Hola mundo! Te escribo desde cliente!');

// Receive greeting from server
socket.on('saludito', (data) => {
  console.log(data);
});

// Receive updated product list from server
socket.on('updatedProducts', (products) => {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; // Clear existing content

  products.forEach((product) => {
    // Create a new list item for each product and append it
    const productItem = document.createElement('div');
    productItem.classList.add(
      'card',
      'shadow-md',
      'rounded-lg',
      'max-w-sm',
      'mx-3',
      'my-3',
      'p-5',
      'bg-slate-100'
    );
    productItem.innerHTML = `
        <h3 class="text-gray-900 font-bold text-xl tracking-tight">${product.title}</h3>
        <p class="text-gray-500 text-s">${product.description}</p>
        <p class="text-gray-900 font-bold text-xl">$${product.price}</p>
        <button class="btn-delete" data-product-id="${product.id}">Eliminar</button>
    `;
    productList.appendChild(productItem);
  });

  // Add event listener for delete button
  const deleteButtons = document.querySelectorAll('.btn-delete');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.productId;
      try {
        const response = await fetch(`/realtimeproducts/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log('Producto eliminado exitosamente');
        } else {
          console.error('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    });
  });
});
