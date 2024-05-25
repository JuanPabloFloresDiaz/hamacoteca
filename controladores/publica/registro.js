async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('main');

    // Carga los componentes de manera síncrona
    const cambiarregistro = await loadComponent('../componentes/registro/registro.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = cambiarregistro;



    // Llamada a la función para establecer la mascara del campo teléfono.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('telefonoRegistro'),
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    });
    // Llamada a la función para establecer la mascara del campo DUI.
    vanillaTextMask.maskInput({
        inputElement: document.getElementById('duiRegistro'),
        mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    });

};



