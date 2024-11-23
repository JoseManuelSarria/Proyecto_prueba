
const productos = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    nombre: `Producto ${i + 1}`,
    precio: (i + 1) * 10,
    imagen: "https://www.puntoblanco.co/cdn/shop/files/ceya-negro-799-729513_000799-1_0b56d9d5-3bf8-4fbf-a44b-22988151a7d4.jpg?v=1721696241"
}));

let carrito = [];
const productosContainer = document.getElementById("productos-container");

function renderProductos() {
    const fragment = document.createDocumentFragment();
    productos.forEach(producto => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-md-6 col-lg-4 mb-4";
        colDiv.innerHTML = `
    <div class="card h-100">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Precio: $${producto.precio}</p>
            <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Comprar</button>
        </div>
    </div>
`;

        fragment.appendChild(colDiv);
    });
    productosContainer.appendChild(fragment);
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    const productoEnCarrito = carrito.find(p => p.id === productoId);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
}

function actualizarCarrito() {
    const carritoContainer = document.getElementById("carrito-container");
    carritoContainer.innerHTML = carrito.map(producto => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <div>
                <button onclick="cambiarCantidad(${producto.id}, -1)" class="btn btn-sm btn-secondary">-</button>
                <span>${producto.cantidad}</span>
                <button onclick="cambiarCantidad(${producto.id}, 1)" class="btn btn-sm btn-secondary">+</button>
                <button onclick="eliminarDelCarrito(${producto.id})" class="btn btn-danger btn-sm">Eliminar</button>
            </div>
        </div>
    `).join("");

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById("carrito-total").innerText = `Total: $${total}`;
}

function cambiarCantidad(productoId, cambio) {
    const producto = carrito.find(p => p.id === productoId);
    if (!producto) return;

    producto.cantidad += cambio;
    if (producto.cantidad <= 0) {
        eliminarDelCarrito(productoId);
    } else {
        actualizarCarrito();
    }
}

function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(producto => producto.id !== productoId);
    actualizarCarrito();
}

function finalizarCompra() {
    // Cerrar el modal de carrito usando el API de Bootstrap
    const carritoModal = bootstrap.Modal.getInstance(document.getElementById("carritoModal"));
    carritoModal.hide();  // Cierra el modal de carrito

    // Mostrar el modal de finalización de compra
    const finalizacionModal = new bootstrap.Modal(document.getElementById("finalizacionModal"));
    finalizacionModal.show();  // Abre el modal de finalización
}


function completarPedido() {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("direccion").value;

    if (!nombre || !email || !direccion) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    alert(`¡Gracias por tu compra, ${nombre}! Te enviaremos un correo de confirmación a ${email}.`);

    // Limpiar carrito y actualizar vista
    carrito = [];
    actualizarCarrito();

    // Resetear el formulario
    document.getElementById("form-finalizacion").reset();

    // Cerrar el modal de finalización
    const finalizacionModal = bootstrap.Modal.getInstance(document.getElementById("finalizacionModal"));
    finalizacionModal.hide();
}


// Inicializar productos en la página
renderProductos();
