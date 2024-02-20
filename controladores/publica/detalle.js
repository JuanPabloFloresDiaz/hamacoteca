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

async function cargarComentarios() {
  const listacomentarios = [
    {
      nombre_usuario: 'Hamaca lover 3000',
      valoracion: '¡Me encanta mi nueva hamaca! Es muy cómoda y resistente. La calidad del tejido es excelente y los colores son hermosos. Definitivamente recomendaría este producto a cualquiera que esté buscando una hamaca de calidad.',
      urlfoto: '../../../recursos/img/foto.png'
    },
    {
      nombre_usuario: 'Hamaca hater 1000',
      valoracion: 'No estoy contento con mi compra. La hamaca que recibí no coincide con la descripción en el sitio web. La calidad del material es pobre y se ve muy frágil. Además, el proceso de entrega fue lento y la comunicación con el vendedor fue deficiente.',
      urlfoto: '../../../recursos/img/foto.png'
    },
    {
      nombre_usuario: 'Jhon Turner',
      valoracion: 'I am neither happy nor dissatisfied, they gave me what I expected.',
      urlfoto: '../../../recursos/img/foto.png'
    }
  ];

  const contenedorComentarios = document.getElementById('comentarios');
  try {
    const response = await fetch(VALORACIONES_API);
    if (!response.ok) {
      throw new Error('Error al obtener los datos de la API');
    }
    const data = await response.json();

    if (data && Array.isArray(data) && data.length > 0) {
      // Mostrar cartas de productos obtenidos de la API
      data.forEach(valoracion => {
        const valoracionHtml = `
        <div class="row g-0">
          <div class="col-md-8">
            <div class="card-body d-flex align-items-start">
                <img src="${valoracion.urlfoto}" class="img-fluid rounded-start mt-3 ms-5 me-3" alt="${valoracion.nombre_usuario}">
                <div class="ms-5">
                    <h5 class="card-title">${valoracion.nombre_usuario}</h5>
                    <p class="card-text">${valoracion.valoracion}</p>
                    <div class="rating">
                        <input type="radio" id="star5" name="rating" value="5"><label for="star5"></label>
                        <input type="radio" id="star4" name="rating" value="4"><label for="star4"></label>
                        <input type="radio" id="star3" name="rating" value="3"><label for="star3"></label>
                        <input type="radio" id="star2" name="rating" value="2"><label for="star2"></label>
                        <input type="radio" id="star1" name="rating" value="1"><label for="star1"></label>
                    </div>
                </div>
            </div>
          </div>
        </div>
            `;
        contenedorCartasProductos.innerHTML += valoracionHtml;
      });
    } else {
      throw new Error('La respuesta de la API no contiene datos válidos');
    }
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    // Mostrar cartas de productos de respaldo
    listacomentarios.forEach(valoracion => {
      const valoracionHtml = `
      <div class="row g-0 ">
      <div class="col-md-8" >
        <div class="card-body d-flex align-items-start">
            <img src="${valoracion.urlfoto}" class="img-fluid rounded-start mt-3 ms-5 me-3" alt="${valoracion.nombre_usuario}">
            <div class="ms-5">
                <h5 class="card-title">${valoracion.nombre_usuario}</h5>
                <p class="card-text">${valoracion.valoracion}</p>
                <div class="rating">
                    <input type="radio" id="star5" name="rating" value="5"><label for="star5"></label>
                    <input type="radio" id="star4" name="rating" value="4"><label for="star4"></label>
                    <input type="radio" id="star3" name="rating" value="3"><label for="star3"></label>
                    <input type="radio" id="star2" name="rating" value="2"><label for="star2"></label>
                    <input type="radio" id="star1" name="rating" value="1"><label for="star1"></label>
                </div>
            </div>
        </div>
      </div>
    </div>
        `;
      contenedorComentarios.innerHTML += valoracionHtml;
    });
  }
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
  cargarComentarios();
  bindQuantityButtons();
};
