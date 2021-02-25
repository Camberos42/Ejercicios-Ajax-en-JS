import stripeKeys from "./stripe-keys.js";
import STRIPE_KEYS from "./stripe-keys.js";

//console.log(STRIPE_KEYS);

const d = document,
    $pizzas = d.getElementById("pizzas"),
    $template = d.getElementById("template-pizza").content,
    $fragment = d.createDocumentFragment(),
    fetchOptions = {
        headers: {
            Authorization: `Bearer ${STRIPE_KEYS.secret}`,
        },
    }

//Se van almacenar en variables las peticiones fetch
let products, prices;

//Formatear el precio. Parametros de funcion slice (donde empiezo, donde termino). Si solo pongo -2 quiero que me traiga los ultimos dos. 
const moneyFormat = (num) => `$${num.slice(0,-2)}.${num.slice(-2)}`;

//Acceder al objeto Promise para llamar al metodo all y de manera de objeto recibir peticiones fetch
Promise.all([
        fetch("https://api.stripe.com/v1/products", fetchOptions),
        fetch("https://api.stripe.com/v1/prices", fetchOptions)

    ]).then(responses => Promise.all(responses.map(res => res.json()))) //Esperara varias respuestas
    .then(json => {
        //Parseo ed json con todos los resultados de ambas solicitudes
        //console.log(json);
        //Acceder solo a la propiedad data
        products = json[0].data;
        prices = json[1].data;
        console.log(products, prices);

        //Formar dinamicamente las tarjetas en el HTML y saber cual es el producto que le corresponde a ese precio (como un vlookup en excel)
        prices.forEach((el) => {
            //Funcion filter para hacer el match con el id del producto ya que ambos arreglos cuentan con ese valor
            let productData = products.filter((product) => product.id === el.product);
            //console.log(productData);

            //Agregarle un data-attribute con valor del id del precio del producto
            $template.querySelector(".pizza").setAttribute("data-price", el.id);
            //Acceder a las imagenes -> DataProducts -> Posicion 0 -> Propiedad images -> Posicion 0
            $template.querySelector("img").src = productData[0].images[0];
            //Nombre del producto (alt de la img) DataProducts -> Posicion 0 -> Propiedad name
            $template.querySelector("img").alt = productData[0].name;
            //Colocar el precio y la moneda 
            $template.querySelector("figcaption").innerHTML = `
            ${productData[0].name}
            <br>
            ${moneyFormat(el.unit_amount_decimal)} ${el.currency}
            `

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });

        $pizzas.appendChild($fragment);
    })
    .catch((err) => {
        console.log(err);
        let message = err.statusText || "Ocurrio un error al conectarse con la API de Stripe";
        $pizzas.innerHTML = `<p>Error ${err,status}:${message}</p>`;
    });

//Crear el evento click para realizar la compra
d.addEventListener("click", (e) => {
    console.log(e.target);
    /*Se le agrega un * para hacer referencia a todo lo que esta dentro del figure pizza (de lo contrario 
    no se pondra el alert porque el matches pensara que se le esta dando click a la imagen o figcaption)*/
    if (e.target.matches(".pizza *")) {
        let price = e.target.parentElement.getAttribute("data-price");
        console.log(price);

        //Redireccionar al servicio de Stripe (devolvera una promesa)
        Stripe(STRIPE_KEYS.public).
        redirectToCheckout({
            lineItems: [{ price, quantity: 1 }], //Se cobraran productos de 1 en 1 (pueden ser mas)
            mode: "subscription",
            successUrl: "http://127.0.0.1:5500/Ejercicios%20Ajax/assets/stripe-sucess.html",
            cancelUrl: "http://127.0.0.1:5500/Ejercicios%20Ajax/assets/stripe-cancel.html",
        }).then((res) => {
            console.log(res)
            if (res.error) {
                $pizzas.insertAdjacentElement("afterend", res.error.message);
            }
        });
    }
});