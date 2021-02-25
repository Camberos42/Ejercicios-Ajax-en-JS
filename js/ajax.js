/* **********     Curso JavaScript: 106. AJAX: Objeto XMLHttpRequest - #jonmircha     ********** */
(() => {
    //1er PASO: Crear la instancia del objeto XMLHttpRequest 
    const xhr = new XMLHttpRequest(),
        $xhr = document.getElementById("xhr"),
        //Para insertar todo los elementos al fragmento y solo cargar ese fragmento al DOM
        $fragment = document.createDocumentFragment();

    //2ER PASO: Asignar los metodos 
    //Evento que se lanzara cuando detecte cualquier cambio de estado
    xhr.addEventListener("readystatechange", (e) => {

        //Todo lo que sea diferente de 4 no retornar nada (para que no imprima todos los estados)
        if (xhr.readyState !== 4) return;
        console.log("XHR object")
        console.log(xhr);

        //Solo cuando la peticion este entre ese rango se ejecuta el codigo para imprimir los usuarios
        if (xhr.status >= 200 && xhr.status < 300) {
            // console.log("éxito");
            //console.log(xhr.responseText); //Imprime todos los datos de los usuarios
            //$xhr.innerHTML = xhr.responseText;

            //Pasar la cadena json a objeto de js
            let json = JSON.parse(xhr.responseText);
            console.log("Datos de la API, Objeto XMLHttpRequest")
            console.log(json);

            //Imprimir cada elemento (usuario)
            json.forEach((el) => {
                const $li = document.createElement("li");
                $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`; //Acceder a las propiedades
                $fragment.appendChild($li);
            });
            $xhr.appendChild($fragment);

        } else {
            let message = xhr.statusText || "Ocurrió un error";
            $xhr.innerHTML = `Error ${xhr.status}: ${message}`;
            //console.log("error");
        }
        //console.log("Este mensaje cargará de cualquier forma");

    });

    //3ER PASO: Abrir la peticion, establecer el metodo por el cual lo haremos y el recurso/endpoint que accederemos
    //Se usa el metodo open(1er param: Metodo de respuesta satisfactoria, la url la cual haremos la peticion)
    xhr.open("GET", "https://jsonplaceholder.typicode.com/users");

    //4TO PASO: Enviar la peticion
    xhr.send();
})();

/* **********     Curso JavaScript: 107. AJAX: API Fetch - #jonmircha     ********** */
(() => {
    const $fetch = document.getElementById("fetch"),
        $fragment = document.createDocumentFragment();

    //Se realiza la peticion fetch (utiliza promesas)
    fetch("https://jsonplaceholder.typicode.com/users").then(res => {
        //Se espera recibir una respuesta
        // console.log(res); //Retorna un ReadableStream

        //convertirlo a json //Si la propiedad ok es falso No continua con la Promesa y se va  al catch
        return res.ok ? res.json() : Promise.reject();

    }).then(json => {
        // console.log(json); //Retorna los elementos (users)

        //Recorrer los objetos, crear lista y agregarlos al HTML
        json.forEach((el) => {
            const $li = document.createElement("li");
            $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`; //Acceder a las propiedades
            $fragment.appendChild($li);
        });
        $fetch.appendChild($fragment);
    }).catch((err) => {
        //Espera un error
        //console.log(err, "Estamos en el catch")
        let message = err.statusText || "Ocurrió un error";
        $fetch.innerHTML = `Error ${err.status}: ${message}`;
    }).finally(
        // console.log("Esto se ejecutara independientemente del resultado de la promesa Fetch")
    )
})();

/* **********     Curso JavaScript: 108. AJAX: API Fetch + Async-Await - #jonmircha     ********** */
(() => {
    const $fetchAsync = document.getElementById("fetch-async"),
        $fragment = document.createDocumentFragment();

    async function getData() {
        //Si hay exito se ejecuta lo siguiente
        try {
            //Await espera que se ejecute esa linea para despues poder ejecutar el resto del codigo
            let res = await fetch("https://jsonplaceholder.typicode.com/users"),
                json = await res.json();
            //console.log(res, json);

            //Se lanzara un objeto con las propiedades del resultado (status y statustext)
            if (!res.ok) throw { status: res.status, statusText: res.statusText }; //throw aroja un flujo al catch

            //Insertar los datos en una lista del html
            json.forEach((el) => {
                const $li = document.createElement("li");
                $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
                $fragment.appendChild($li);
            });

            //Afregarlo al fracgmento
            $fetchAsync.appendChild($fragment);

            //Si hay error se ejecuta lo siguiente
        } catch (err) {
            //console.log(err);
            let message = err.statusText || "Ocurrió un error";
            $fetchAsync.innerHTML = `Error ${err.status}: ${message}`;
        } finally {
            //console.log("Esto se ejecutará independientemente del try... catch");
        }
    }

    // Ejecutar la funcion asincrona
    getData();
})();

/* **********     Curso JavaScript: 109. AJAX: Librería Axios - #jonmircha     ********** */
(() => {
    const $axios = document.getElementById("axios"),
        $fragment = document.createDocumentFragment();

    //libreria axios y ejecutar sus metodos
    axios
    //.get("assets/users.json")
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
            console.log("Libreria Axios")
            console.log(res); //Ver el objeto / resultado
            let json = res.data; //agregarle lo que viene en la propiedad data del resultado

            json.forEach((el) => {
                const $li = document.createElement("li");
                $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
                $fragment.appendChild($li);
            });

            $axios.appendChild($fragment);
        })
        .catch((err) => {
            //Devuelve un objeto con el error. (error.response)
            //console.log(err.response);
            let message = err.response.statusText || "Ocurrió un error";
            $axios.innerHTML = `Error ${err.response.status}: ${message}`;
        })
        .finally(() => {
            //console.log("Esto se ejecutará independientemente del resultado Axios");
        });
})();

/* **********     Curso JavaScript: 110. AJAX: Librería Axios + Async-Await - #jonmircha     ********** */
(() => {
    const $axiosAsync = document.getElementById("axios-async"),
        $fragment = document.createDocumentFragment();

    async function getData() {
        try {
            let res = await axios.get("https://jsonplaceholder.typicode.com/users"), //Espera a axios.get(url de api)
                json = await res.data; //No es necesario convertirsion, ya en la propiedad data vienen los datos parseados

            //console.log(res, json);

            json.forEach((el) => {
                const $li = document.createElement("li");
                $li.innerHTML = `${el.name} -- ${el.email} -- ${el.phone}`;
                $fragment.appendChild($li);
            });

            $axiosAsync.appendChild($fragment);
        } catch (err) {
            //console.log(err.response);
            let message = err.response.statusText || "Ocurrió un error";
            $axiosAsync.innerHTML = `Error ${err.response.status}: ${message}`;
        } finally {
            //console.log("Esto se ejecutará independientemente del try... catch");
        }
    }

    getData();
})();