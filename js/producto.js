class Producto {
    constructor(id, nombre, img, descripcion, precio, cantidad) {
            this.id = id;
            this.nombre = nombre.toUpperCase();
            this.img= img;
            this.descripcion= descripcion;
            this.precio = parseFloat(precio) || 150;            
            this.cantidad= cantidad || 1;
    }
    
    addCantidad(){
        this.cantidad++;                
    }
    subTotal(){
        return this.precio * this.cantidad;                
    }
    
    agregarCantidad (valor){
        this.cantidad += valor;
    }    
}
