async function loadComponent(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

// window.onload
window.onload = async function () {
    // Obtiene el contenedor principal
    const appContainer = document.getElementById('configuracion');

    // Carga los componentes de manera síncrona
    const adminHtml = await loadComponent('../componentes/configuracion/configuracion.html');
    const navbarHtml = await loadComponent('../componentes/componentes_generales/menu_desplegable/barra_superior.html');
    // Agrega el HTML del encabezado
    appContainer.innerHTML = navbarHtml + adminHtml;
    const theme = localStorage.getItem('theme'); // Obtener el tema desde localStorage

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }

    const switchInput = document.getElementById('flexSwitchCheckChecked');

    switchInput.addEventListener('change', function() {
        if (this.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    function enableDarkMode() {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
        // Guardar el estado en localStorage o cookies si lo deseas
    }

    function disableDarkMode() {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        // Guardar el estado en localStorage o cookies si lo deseas
    }
};
