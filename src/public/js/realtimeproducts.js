const socket = io();

socket.on("realtimeproducts", data => {
    limpiarSelectEliminarProducto();
    let contenidoHTML = "";

    data.forEach(item => {
        contenidoHTML += `<div class="col-md-3">
            <div class="card text-center border-0 fw-light">
                <img src="${item.thumbnails[0]}" class="img-fluid" alt="${item.title}">
                <div class="card-body">
                    <p class="card-text">${item.title}</p>
                    <p class="card-text">$${item.price}</p>
                </div>
            </div>
        </div>`;

        agregarItemEliminarProducto(item);
    });

    contenidoHTML += "</ul>";
    document.getElementById("content").innerHTML = contenidoHTML;
})

const agregarProducto = () => {
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const code = document.getElementById("code");
    const price = document.getElementById("price");
    const category = document.getElementById("category");
    const image = document.getElementById("image");
    
const validarCampo = (campo, nombre) => {
        if (!campo.value.trim()) {
            /*estadoProducto.innerHTML = `<div class="alert alert-danger" role="alert">El campo '${nombre}' está vacío!</div>`;*/
            alert(`El campo '${nombre}' está vacío!`);
            campo.focus();
            return false;
        }
        return true;
    };

    // Validar todos los campos
    if (!validarCampo(title, 'title') ||
        !validarCampo(description, 'description') ||
        !validarCampo(code, 'code') ||
        !validarCampo(category, 'category')) {
        return;

    
    }

    if (isNaN(price.value) || !price.value.trim()) {
        alert(`El campo 'price' debe ser un número válido!`);
        price.focus(); // Mueve el foco al campo de precio
        return;
    }
    
    
    const product = {
        title:title.value, 
        description:description.value, 
        code:code.value, 
        price:price.value, 
        category:category.value, 
        image:image.value
    };
    
    
    socket.emit("nuevoProducto", product);
    title.value = "";   
    description.value = "";   
    code.value = "";   
    price.value = "";
    category.value = "";   
    image.value = "";
    document.getElementById("producto_estado1").innerHTML = `<div class="alert alert-success"role="alert">El producto se agregó correctamente!</div>`;
}


const limpiarSelectEliminarProducto = () => {
    const productId = document.getElementById("product_id");
    productId.innerHTML = "";
}

const agregarItemEliminarProducto = (item) => {
    const productId = document.getElementById("product_id");
    let option = document.createElement("option");
    option.value = item.id;
    option.innerHTML = "Producto #" + item.id +" " + item.title;
    productId.appendChild(option);
}

const eliminarProducto = () => {
    const product_id = document.getElementById("product_id").value;
    const product_option = document.getElementById("product_id").selectedOptions[0];
    const nombre = product_option ? product_option.text.split(' ')[2] : 'desconocido';

    if (confirm(`¿Está seguro de eliminar el producto '${nombre}'?`)) {
        socket.emit("eliminarProducto", product_id);
        document.getElementById("producto_estado1").innerHTML = `<div class="alert alert-success" role="alert">El producto '${nombre}' se eliminó correctamente!</div>`;
    } else {
        document.getElementById("producto_estado1").innerHTML = `<div class="alert alert-info" role="alert">La eliminación del producto '${nombre}' fue cancelada.</div>`;
    }
};
