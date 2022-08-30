
cargarDatos();



if('Carrito' in localStorage){

  let guardados= JSON.parse(localStorage.getItem('Carrito'));

  for (const generico of guardados) {
    carrito.push(new Producto(generico.id, generico.nombre, generico.img, generico.descripcion, generico.precio, generico.cantidad));    
  }

  carritoHTML(carrito);
}


confirmar.onclick = () => {  
  enviarDatos() ;     
}




setTimeout(()=>{
 
  Toastify({
    text: `QUERES CONTACTARNOS?`,                                
    duration: 3000,
    style: {
            background: "blue",
          },
    onClick: function () {
      location.href="https://api.whatsapp.com/message/3APTJG3AQSYAF1?autoload=1&app_absent=0";       
    },
    gravity: "bottom"                                
    }).showToast();
},5000);













