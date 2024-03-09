async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

function bindQuantityButtons() {
    $("#btnDecrease").click(function () {
        var currentValue = parseInt($("#quantityInput").val());
        if (currentValue > 1) {
            $("#quantityInput").val(currentValue - 1);
        }
    });

    $("#btnIncrease").click(function () {
        var currentValue = parseInt($("#quantityInput").val());
        $("#quantityInput").val(currentValue + 1);
    });
}

function validarCantidad(input) {
    // Obtener el valor ingresado como un número entero
    var valor = parseInt(input.value);
    // Verificar si el campo está vacío
    if (input.value === "") {
        // Establecer el valor predeterminado en 1
        input.value = 1;
    }
    // Verificar si el valor es negativo
    if (valor < 1) {
        // Si es negativo, establecer el valor como 1
        input.value = 1;
    }
}


const openAlert = async (id) => {
    try {
        // Se define un objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('id_pedido', id);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PEDIDO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra la caja de diálogo con su título.
            SAVE_MODAL.show();
            MODAL_TITLE.textContent = 'Estas seguro de realizar su compra';
            // Se prepara el formulario.
            SAVE_FORM.reset();
            EXISTENCIAS_PRODUCTO.disabled = true;
            // Se inicializan los campos con los datos.
            const ROW = DATA.dataset;
            ID_ADMINISTRADOR.value = ROW.id_administrado;
            NOMBRE_ADMINISTRADOR.value = ROW.nombre_administrador;
            CORREO_ADMINISTRADOR.value = ROW.correo_administrador;
            TELEFONO_ADMINISTRADOR.value = ROW.telefono_administrador;
            DUI_ADMINISTRADOR.value = ROW.dui_administrador;
            NACIMIENTO_ADMINISTRADOR.value = row.fecha_nacimiento_administrador;
            CLAVE_ADMINISTRADOR.value = ROW.clave_administrador;
            ALIAS_ADMINISTRADOR.value = ROW.alias_administrador;
            fillSelect(ROL_API, 'readAll', 'rolAdministrador', ROW.id_rol);
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } catch (Error) {
        console.log(Error);
        var currentValue = parseInt($("#quantityInput").val());
        confirmUpdateAction('Se agregaran ' + currentValue + " productos a su carrito")
    }

};

const listacomentarios = [
    {
        index: 1,
        nombre_usuario: 'Hamaca lover 3000',
        valoracion: '¡Me encanta mi nueva hamaca! Es muy cómoda y resistente. La calidad del tejido es excelente y los colores son hermosos. Definitivamente recomendaría este producto a cualquiera que esté buscando una hamaca de calidad.',
        urlfoto: '../../../recursos/img/foto.png',
        nota: 5
    },
    {
        index: 2,
        nombre_usuario: 'Hamaca hater 1000',
        valoracion: 'No estoy contento con mi compra. La hamaca que recibí no coincide con la descripción en el sitio web. La calidad del material es pobre y se ve muy frágil. Además, el proceso de entrega fue lento y la comunicación con el vendedor fue deficiente.',
        urlfoto: '../../../recursos/img/foto.png',
        nota: 1
    },
    {
        index: 3,
        nombre_usuario: 'Jhon Turner',
        valoracion: 'I am neither happy nor dissatisfied, they gave me what I expected.',
        urlfoto: '../../../recursos/img/foto.png',
        nota: 3
    },
];
async function cargarComentarios(listacomentarios) {
    const contenedorComentarios = document.getElementById('comentarios');
    try {
        const response = await fetch(VALORACIONES_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();

        // Mostrar cartas de productos obtenidos de la API
        listacomentarios.forEach((valoracion, index) => {
            const comentario = data[index]; // Obtener el comentario correspondiente
            if (comentario) {
                const valoracionHtml = `
                <div class="row g-0 carta-comentario">
                <div class="col-md-2 d-flex align-items-start">
                 <img src="${valoracion.urlfoto}" class="img-fluid circulo mt-3 ms-5 me-3" width="50px" height="50px" alt="${valoracion.nombre_usuario}">
                 <h5 class="card-title">${valoracion.nombre_usuario}</h5>
                 </div>
                 <div class="col-md-10">
                  <div class="card-body d-flex align-items-start">
                     <div class="ms-5">
                        <p class="card-text">${valoracion.valoracion}</p>
                         <p class="text-white" id="ratingValue">${valoracion.nota}</p>
                         <div class="rating">
                             <input type="radio" id="star5_${index}" name="rating_${index}" value="5"><label for="star5_${index}"></label>
                             <input type="radio" id="star4_${index}" name="rating_${index}" value="4"><label for="star4_${index}"></label>
                             <input type="radio" id="star3_${index}" name="rating_${index}" value="3"><label for="star3_${index}"></label>
                             <input type="radio" id="star2_${index}" name="rating_${index}" value="2"><label for="star2_${index}"></label>
                             <input type="radio" id="star1_${index}" name="rating_${index}" value="1"><label for="star1_${index}"></label>
                         </div>
                  </div>
                 </div>
                 </div>
             </div>
                `;
                contenedorComentarios.innerHTML += valoracionHtml;
            }
        });
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar cartas de productos de respaldo
        listacomentarios.forEach((valoracion, index) => {
            const comentario = listacomentarios[index]; // Obtener el comentario correspondiente
            if (comentario) {
                const valoracionHtml = `
                <div class="row g-0 carta-comentario">
                   <div class="col-md-2 d-flex align-items-start">
                    <img src="${valoracion.urlfoto}" class="img-fluid circulo mt-3 ms-5 me-3" width="50px" height="50px" alt="${valoracion.nombre_usuario}">
                    <h5 class="card-title">${valoracion.nombre_usuario}</h5>
                    </div>
                    <div class="col-md-10">
                     <div class="card-body d-flex align-items-start">
                        <div class="ms-5">
                            
                            <p class="card-text">${valoracion.valoracion}</p>
                            <p class="text-white" id="ratingValue">${valoracion.nota}</p>
                            <div class="rating">
                                <input type="radio" id="star5_${index}" name="rating_${index}" value="5"><label for="star5_${index}"></label>
                                <input type="radio" id="star4_${index}" name="rating_${index}" value="4"><label for="star4_${index}"></label>
                                <input type="radio" id="star3_${index}" name="rating_${index}" value="3"><label for="star3_${index}"></label>
                                <input type="radio" id="star2_${index}" name="rating_${index}" value="2"><label for="star2_${index}"></label>
                                <input type="radio" id="star1_${index}" name="rating_${index}" value="1"><label for="star1_${index}"></label>
                            </div>
                     </div>
                    </div>
                    </div>
                </div>
                `;
                contenedorComentarios.innerHTML += valoracionHtml;
            }
        });
    }

    // Captura todas las estrellas
    var stars = document.querySelectorAll('.rating input');

    // Marca las estrellas según la nota de cada comentario y desactiva la interactividad
    stars.forEach(function (star, index) {
        var comentario = listacomentarios[index];
        if (comentario && comentario.nota) {
            var nota = comentario.nota; // Obtener la nota del comentario actual
            // Marca las estrellas según la nota del comentario
            for (var i = 0; i < nota; i++) {
                document.getElementById(`star${nota}_${index}`).checked = true;
            }
            // Desactiva la interactividad de las estrellas después de marcarlas
            for (var j = 1; j <= 5; j++) {
                document.getElementById(`star${j}_${index}`).disabled = true;
            }
        }
    });
    // Evento para las estrellas
    stars.forEach(function (star, index) {
        star.addEventListener('click', function () {
            console.log('Comentario:', listacomentarios[index]);
            console.log('Nota:', listacomentarios[index].nota);
        });
    });
}


// Constantes para completar la ruta de la API.
const DETALLES_API = '';
const VALORACIONES_API = '';

// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('detalle');
    // Carga los componentes de manera síncrona
    const headerHtml = await loadComponent('../componentes/componentes_generales/barra_superior/barra_superior.html');
    const detalleHtml = await loadComponent('../componentes/detalle_producto/producto/detalle_producto.html');
    const valoracionesHtml = await loadComponent('../componentes/detalle_producto/valoraciones/valoraciones.html');
    const footerHtml = await loadComponent('../componentes/componentes_generales/barra_inferior/barra_inferior.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML += `${headerHtml}`;
    appContainer.innerHTML += `${detalleHtml}`;
    appContainer.innerHTML += `${valoracionesHtml}`;
    appContainer.innerHTML += `${footerHtml}`;

    console.log("El evento window.onload se ha disparado.");

    // Captura el valor del rating del h3
    var ratingValue = parseFloat(document.getElementById('ratingValue').textContent);
    console.log("Valor del rating obtenido:", ratingValue);

    // Intenta imprimir un mensaje después de obtener el ratingValue
    console.log("Este mensaje se imprime después de obtener el ratingValue:", ratingValue);

    // Captura todas las estrellas
    var stars = document.querySelectorAll('.rating input');

    // Marca las estrellas según el rating
    stars.forEach(function (star, index) {
        if (index + 0 <= 5 - ratingValue) { // Ajustar la condición
            star.checked = true;
            console.log("Estrella marcada:", index + 1);
            // Desactiva la interactividad de las estrellas
            star.disabled = true;
        }
    });

    // Colorea las estrellas marcadas de naranja
    var checkedStars = document.querySelectorAll('.rating input:checked');
    checkedStars.forEach(function (star) {
        star.nextElementSibling.style.color = 'orange';
        console.log("Estrella coloreada de naranja:", star.id);
    });

    cargarComentarios(listacomentarios);
    bindQuantityButtons();
    document.getElementById('toggleFooterBtn').addEventListener('click', function () {
        var footer = document.querySelector('footer');
        footer.classList.toggle('d-none');
    });
};
