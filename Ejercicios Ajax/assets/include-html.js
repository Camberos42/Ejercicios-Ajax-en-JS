document.addEventListener("DOMContentLoaded", (e) => {

    //Funcion que contrendra la peticion ajax
    const includeHTML = (el, url) => {
        const xhr = new XMLHttpRequest();

        //Status de la peticion
        xhr.addEventListener("readystatechange", (e) => {
            if (xhr.readyState !== 4) return;

            if (xhr.status >= 200 && xhr.status < 300) {
                el.outerHTML = xhr.responseText; //Outer para que no se visualice el data-attribute
            } else {
                let message = xhr.status || "Error al cargar el archivo, verifica que estes haciendo la peticion por http p https";
                el.outerHTML = `<di><p>Error ${xhr.status}: ${message}</p></div>`
            }
        });

        xhr.open("GET", url);
        xhr.setRequestHeader("Content-type", "text/html: charset=utf-8");
        xhr.send();
    }

    //Obtener las url gracias a los data-atributes
    const data_include = document.querySelectorAll("[data-include]");

    data_include.forEach(el => includeHTML(el, el.getAttribute("data-include")));

});