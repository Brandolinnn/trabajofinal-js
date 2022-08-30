Swal.fire({
        title: 'REGISTRARSE',
        html: `<input type="text" id="login" class="swal2-input" placeholder="Nombre de usuario">
        <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
        confirmButtonText: 'Siguiente',
        focusConfirm: false,
        preConfirm: () => {
          const login = Swal.getPopup().querySelector('#login').value
          const password = Swal.getPopup().querySelector('#password').value
          if (!login|| !password) {
            Swal.showValidationMessage(`Por favor ingrese los datos`)
          }
          return { login: login, password: password }
        }
      }).then((result) => {
        Swal.fire(`
          Usuario: ${result.value.login}
          Contraseña: ${result.value.password}
        `.trim()) 
        
      })

function productosUI(productos, id) {
        let productosRender = document.getElementById(id);
        productosRender.innerHTML = "";
        for (const producto of productos) {
                let divProducto = document.createElement("div");
                divProducto.classList.add('col');
                
                divProducto.innerHTML = `<div class="card  bg-primary text-white rounded " style="width: 20rem; margin:50px; ">
                                        <img src="${producto.img}" class="card-img-top" alt="...">
                                        <div class="card-body">
                                        <h5 class="card-title">${producto.nombre}</h5>
                                        <p class="card-text">${producto.descripcion}</p>
                                        <p class="card-text">Precio: $${producto.precio}</p>
                                        <button id='${producto.id}' class = 'btnCompra btn btn-light'>Comprar</button>
                                        </div>
                                        </div>`
                productosRender.append(divProducto);
        }
        seleccionarProducto();
}

function seleccionarProducto() {
        let botones = document.getElementsByClassName('btnCompra');
        for (const boton of botones) {
                boton.addEventListener('click', function () {
                        let seleccion = carrito.find(producto => producto.id == this.id);
                        if (seleccion) {
                                seleccion.addCantidad();
                        } else {
                                seleccion = productos.find(producto => producto.id == this.id);
                                carrito.push(seleccion);
                        }
                        localStorage.setItem('Carrito', JSON.stringify(carrito));
                        
                        carritoHTML(carrito);
                        
                        Toastify({
                                text: `Se ha agregado el producto al carrito`,
                                duration: 3000,
                                style: {
                                        background: "black",
                                },
                                gravity: "bottom"
                        }).showToast();
                })
        }

}

function carritoHTML(lista) {
        cantidadCarrito.innerHTML = lista.length;
        productosCarrito.innerHTML = "";
        for (const producto of lista) {
                let prod = document.createElement('div');
                prod.classList.add('bg-dark');
                prod.innerHTML = `<span class="badge bg-primary text-light">${producto.nombre} </span>
                <span class="badge bg-primary text-light">Precio: $ ${producto.precio}</span>
                <span class="badge bg-primary">Cantidad: ${producto.cantidad}</span>
                <span class="badge bg-light text-dark">Subtotal: $${producto.subTotal()}</span>
                <a id="${producto.id}" class="btn btn-success btn-add">+</a>
                <a id="${producto.id}" class="btn btn-danger btn-sub">-</a>
                <a id="${producto.id}" class="btn btn-secondary btn-delete">x</a>    
                `;
                productosCarrito.append(prod);
        }
        sumarCarrito();
        document.querySelectorAll('.btn-delete').forEach(boton => boton.onclick = eliminarCarrito);
        document.querySelectorAll('.btn-add').forEach(boton => boton.onclick = addCarrito);
        document.querySelectorAll('.btn-sub').forEach(boton => boton.onclick = subCarrito);
}

function eliminarCarrito() {
        let posicion = carrito.findIndex(producto => producto.id == this.id);
        carrito.splice(posicion, 1);
        carritoHTML(carrito);
        localStorage.setItem('Carrito', JSON.stringify(carrito));
}

function addCarrito() {
        let producto = carrito.find(producto => producto.id == this.id);
        producto.agregarCantidad(1);
        this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
        this.parentNode.children[2].innerHTML = "Subtotal: " + producto.subTotal();
        sumarCarrito();
        localStorage.setItem('Carrito', JSON.stringify(carrito));
}

function subCarrito() {
        let producto = carrito.find(producto => producto.id == this.id);
        if (producto.cantidad > 1) {
                producto.agregarCantidad(-1);
                this.parentNode.children[1].innerHTML = "Cantidad: " + producto.cantidad;
                this.parentNode.children[2].innerHTML = "Subtotal: " + producto.subTotal();
                sumarCarrito();
                localStorage.setItem('Carrito', JSON.stringify(carrito));
        }
}

function sumarCarrito() {
        let total = carrito.reduce((totalCompra, producto) => totalCompra += producto.subTotal(), 0);
        totalCarritoInterfaz.innerHTML = "Total: $" + total;
        return total;
}


function enviarDatos(lista) {
        fetch('https://jsonplaceholder.typicode.com/posts', {
                method: "POST",
                body: JSON.stringify({ carrito: lista, userID: 666 }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
        }).then((respuesta) => { return respuesta.json()} )
                .then((datos) => {

                        Swal.fire({
                                title: 'Quiere confirmar la compra?',
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: 'Confirmar',
                                denyButtonText: 'No',
                                customClass: {
                                  actions: 'my-actions',
                                  cancelButton: 'order-1 right-gap',
                                  confirmButton: 'order-2',
                                  denyButton: 'order-3',
                                }
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  Swal.fire('Gracias por su compra!', '', 'success')
                                } else if (result.isDenied) {
                                  Swal.fire('No se confirmo su compra', '', 'info')
                                }  vaciarCarrito();
                              }) 
                }) 
}


async function cargarDatos() {
        const pedido = await fetch('js/films.json');
        const datosJson = await pedido.json();
        for (const generico of datosJson) {
                productos.push(new Producto(generico.id, generico.nombre, generico.img, generico.descripcion, generico.precio, generico.cantidad))
        }
        productosUI(productos, 'productosContenedor');
}


function vaciarCarrito() {
        localStorage.clear();
        carrito.splice(0, carrito.length);
        carritoHTML(carrito);
}



