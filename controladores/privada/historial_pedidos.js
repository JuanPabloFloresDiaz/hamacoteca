
async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// Constantes para completar las rutas de la API.
const PEDIDOS_API = '';

async function cargarTabla() {
    const listapedidos = [
        {
            producto: 'Hamaca ligera',
            precio: 200,
            cantidad: 1,
            cliente: 'Joel Ramírez',
            descricpion: 'Este pedido por una hamaca ligera fue realizado y cotizado a las 22:40 del dia viernes 23 de febrero, Hamacoteca ofrece un servicio de calidad.',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
            direccion: 'San Salvador, Colonia Escalon',
            fecha: '2023-02-26',
            estado: 'Pendiente',
            id: 1
        },
        {
            producto: 'Hamaca ligera',
            precio: 200,
            cantidad: 1,
            cliente: 'Juan Pablo',
            descricpion: 'Este pedido por una hamaca ligera fue realizado y cotizado a las 13:28 del dia lunes 19 de febrero, Hamacoteca ofrece un servicio de calidad.',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
            direccion: 'San Salvador, Mejicanos',
            fecha: '2023-03-06',
            estado: 'Pendiente',
            id: 2
        },
        {
            producto: 'Hamaca ligera',
            precio: 200,
            cantidad: 1,
            cliente: 'Xochilt López',
            descricpion: 'Este pedido por una hamaca ligera fue realizado y cotizado a las 12:30 del dia jueves 15 de febrero, Hamacoteca ofrece un servicio de calidad.',
            urlfoto: '../../../recursos/img/hamaca 3.jpg',
            direccion: 'San Salvador, Colonia Escalon',
            fecha: '2023-03-26',
            estado: 'Pendiente',
            id: 3
        },
    ];
    const cargarTabla = document.getElementById('tabla_pedidos');

    try {
        const response = await fetch(DATOS_TABLA_API);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            // Mostrar elementos de la lista de materiales obtenidos de la API
            data.forEach(row => {
                const tablaHtml = `
                <tr>
                    <td><img src="${SERVER_URL}images/categorias/${row.imagen_hamaca}" height="50" width="50" class="circulo"></td>
                    <td>${row.nombre_hamaca}</td>
                    <td>${row.nombre_cliente}</td>
                    <td>${row.descripcion_pedido}</td>
                    <td>${row.direccion_pedido}</td>
                    <td>${row.cantidad_hamaca}</td>
                    <td>${row.precio_hamaca}</td>
                    <td>${row.fecha_pedido}</td>
                    <td>${row.estado_pedido}</td>
                    <td>
                        <button type="button" class="btn btn-warning" onclick="openReport(${row.id_pedido})">
                            <i class="bi bi-filetype-pdf"></i>
                        </button>
                    </td>
                </tr>
                `;
                cargarTabla.innerHTML += tablaHtml;
            });
        } else {
            throw new Error('La respuesta de la API no contiene datos válidos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        // Mostrar materiales de respaldo
        listapedidos.forEach(row => {
            const tablaHtml = `
            <tr>
                <td><img src="${row.urlfoto}" height="50" width="50" class="circulo"></td>
                    <td>${row.producto}</td>
                    <td>${row.cliente}</td>
                    <td>${row.descricpion}</td>
                    <td>${row.direccion}</td>
                    <td>${row.cantidad}</td>
                    <td>${row.precio}</td>
                    <td>${row.fecha}</td>
                    <td class="text-warning">${row.estado}</td>
                <td>
                        <button type="button" class="btn btn-warning" onclick="openReport(${row.id})">
                            <i class="bi bi-filetype-pdf"></i>
                        </button>
                </td>
            </tr>
            `;
            cargarTabla.innerHTML += tablaHtml;
        });
    }
}


// window.onload
window.onload = async function () {

    // Obtiene el contenedor principal
    const appContainer = document.getElementById('pedidos');

    // Carga los componentes de manera síncrona
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    const pedidosHtml = await loadComponent('../componentes/pedidos/historial_pedidos.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + pedidosHtml;
    cargarTabla();
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
};
