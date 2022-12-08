document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem("puntaje") != null) {
        cargarPuntaje();
    }

    const anuncio = document.getElementById("dAnuncio");
    anuncio.style.display = "none";

    const btnRonda = document.getElementById("btnRonda");
    btnRonda.style.display = "none";

    const puerta1 = crearPuerta(document.getElementById("p1"));
    const puerta2 = crearPuerta(document.getElementById("p2"));
    const puerta3 = crearPuerta(document.getElementById("p3"));
    const puertasT = [puerta1, puerta2, puerta3]

    const btnJuego = document.getElementById("btnJuego");
    btnJuego.onclick = function() 
    {
        location.reload();
        localStorage.removeItem("puntaje");
    };

    btnRonda.onclick = function()
    {
        location.reload();
    };
    
    generarContenido(puertasT)
    console.log(puertasT[0].contenido);
    console.log(puertasT[1].contenido);
    console.log(puertasT[2].contenido);
    let contador = 0;
    seleccionarPuerta(puertasT, contador)
})

//Funcion para asignar el contenido que tendran las puertas(cabras o carros)
//puertas: arreglo que representa las puertas del juego
function generarContenido(puertas) {
    const premios = ["cabra", "carro"];
    let maximo = premios.length;
    let minimo = 0;
    let contCeros = 0;//variable para determinar si ya se han generado todas las cabras necesarias


    puertas.forEach(e => {
        let azar = generarNumeroAleatorio(maximo, minimo)
        if (azar == 1) { //Si se genero un uno(carro), se cambias los valores de maximo y minimo para asi solo generar ceros(cabras)
            maximo = 1;
            minimo = 0;
        } else {
            contCeros++;
            if (contCeros == 2) { //Si se genero dos ceros(cabras), se cambias los valores de maximo y minimo para asi solo generar un uno(carro)
                maximo = 1
                minimo = 1;
            }
        }

        e.contenido = premios[azar];
        if (e.contenido == "cabra") { //Cargando sonido a las puertas dependiendo del contenido que tengan
            e.sonidoPremio = cargarSonido("src/cabra.mp3");
        } else {
            e.sonidoPremio = cargarSonido("src/carro.wav");
        }
    });
}

//maximo es el valor que va a indicar el limite del Math.Random
//minimo sirve para indicar el minimo del Math.Random
function generarNumeroAleatorio(maximo, minimo) {
    return Math.floor(Math.random() * maximo) + minimo;
}

//Funcion para crear un objeto puerta que tendrar diferentes atributos
//e: referencia al boton que actua de puerta en el html
function crearPuerta(e) {
    p = {
        puerta: e,
        contenido: "",
        sonidoPuertaA: cargarSonido("src/door-open.mp3"),
        sonidoPuertaC: cargarSonido("src/door-close.mp3"),
        sonidoPremio: ""
    };

    return p;
}

//Funcion que abarca toda la logica cuando el usuario selecciona una puerta
//puertasT: arreglo que representa las puertas del juego
//c: contador que servira para determinar si es la primera decision del usuario o no

function seleccionarPuerta(puertasT, c) {
    const anuncio = document.getElementById("dAnuncio");
    let numeroValido = false; //variable para determinar que puerta abrira automaticamente el programa
    puertaSeleccionada = null; //variable para indicar que puerta escogio el usuario
    cambio = false; //variable para indicar si el usuario cambio de puerta o escogio la misma



    puertasT.forEach(e => {
        e.puerta.onclick = function() {
            e.puerta.parentNode.style.boxShadow = "0px 2px 5px 0.1px black";  //sombra para indicar que puerta escogio el usuario
            c++;
            if (c == 1) { //Condicional para determinar si es la primera puerta que escoge el usuario
                while (numeroValido == false) { //condicional para que el programa determine que puerta abrir automaticamente
                    n = generarNumeroAleatorio(3, 0);
                    if (n != puertasT.indexOf(e) && puertasT[n].contenido == "cabra") numeroValido = true;
                }
                puertasT[n].sonidoPremio.play();
                puertasT[n].puerta.disabled = true;
                puertasT[n].sonidoPuertaA = null;
                puertasT[n].sonidoPuertaC = null;
                str = "img" + (n + 1) //Obtener la etiqueta imagen que se va a cambiar

                const lblSub = document.getElementById("lblSub");
                lblSub.innerHTML = "¿Desea cambiar de puerta?"
                lblSub.style.display = "block";
                lblSub.style.animationName = "victoria";
                lblSub.style.animationDuration = "2s"
                lblSub.style.animationFillMode = "forwards"

                var img = document.getElementById(str);
                img.style.backgroundImage = "url(src/cabra_puerta.png)";
                puertaSeleccionada = e; 

            } else { 
                e.sonidoPremio.play();
                if (puertaSeleccionada == e) //Comprobar si el usuario cambio de puerta o no
                    cambio = false;
                else
                {
                    cambio = true;
                    puertaSeleccionada.puerta.parentNode.style.boxShadow = "";
                }
                    

                str = "img" + (puertasT.indexOf(e) + 1);
                var img = document.getElementById(str);

                lblSub.style.display = "none"; //Ocultar el label de subtitulo


                //Ejecutar animaciones y sonidos dependiendo de si el usuario gano o perdio
                if (e.contenido == "cabra") {
                    img.style.backgroundImage = "url(src/cabra_puerta.png)";
                    anuncio.innerHTML = "Derrota";
                    anuncio.style.display = "block";
                    anuncio.style.animationName = "derrota";
                    anuncio.style.animationDuration = "2s"
                    anuncio.style.animationFillMode = "forwards";

                } else {
                    img.style.backgroundImage = "url(src/carro_puerta.png)";
                    anuncio.innerHTML = "Victoria";
                    anuncio.style.display = "block";
                    anuncio.style.animationName = "victoria";
                    anuncio.style.animationDuration = "2s"
                    anuncio.style.animationFillMode = "forwards"
                }

                e.sonidoPuertaA = null; //Colocar los sonidos a nulo para que ya no se reproduzcan una ves abierta la puerta
                e.sonidoPuertaC = null;
                guardarPuntaje(e, cambio)
                desactivarBotones(puertasT);
                mostrarBotonNRonda();
            }
        }

        //Eventos para cuando el usuario pasa el raton sobre las puertas
        e.puerta.addEventListener("mouseover", function() {
            if (e.sonidoPuertaA != null) {
                e.sonidoPuertaA.play();
                e.sonidoPuertaC.pause();
                e.sonidoPuertaC.currentTime = 0;
            }
        });
        e.puerta.addEventListener("mouseout", function() {
            if (e.sonidoPuertaC != null) {
                e.sonidoPuertaC.play();
                e.sonidoPuertaA.pause();
                e.sonidoPuertaA.currentTime = 0;
            }


        });
    });
}

function guardarPuntaje(e, cambio) {
    const tb_perd_camb = document.getElementById("perd_camb");
    const tb_perd_no_camb = document.getElementById("perd_no_camb");
    const tb_vict_camb = document.getElementById("vict_camb");
    const tb_vict_no_camb = document.getElementById("vict_no_camb");
    let puntaje = [0, 0, 0, 0]

    if (localStorage.getItem("puntaje") != null) {
        puntaje = localStorage.getItem("puntaje").split(",");
        cargarPuntaje();
    }



    if (e.contenido == "cabra") {
        if (cambio == true) {
            tb_perd_camb.innerHTML = parseInt(tb_perd_camb.innerHTML) + 1
            puntaje[2]++;
        } else {
            tb_perd_no_camb.innerHTML = parseInt(tb_perd_no_camb.innerHTML) + 1
            puntaje[3]++;
        }
    } else {
        if (cambio == true) {
            tb_vict_camb.innerHTML = parseInt(tb_vict_camb.innerHTML) + 1
            puntaje[0]++;
        } else {
            tb_vict_no_camb.innerHTML = parseInt(tb_vict_no_camb.innerHTML) + 1
            puntaje[1]++;
        }

    }

    localStorage.setItem("puntaje", puntaje);
    cargarPuntaje()
}


function cargarPuntaje() {
    let puntaje = localStorage.getItem("puntaje").split(",");

    const tb_perd_camb = document.getElementById("perd_camb");
    const tb_perd_no_camb = document.getElementById("perd_no_camb");
    const tb_vict_camb = document.getElementById("vict_camb");
    const tb_vict_no_camb = document.getElementById("vict_no_camb");

    tb_perd_no_camb.innerHTML = puntaje[3];
    tb_perd_camb.innerHTML = puntaje[2];
    tb_vict_no_camb.innerHTML = puntaje[1];
    tb_vict_camb.innerHTML = puntaje[0];

}

function desactivarBotones(botones) {
    botones.forEach(element => {
        element.puerta.disabled = true;
    });
}

function cargarSonido(fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none";
    document.body.appendChild(sonido);
    return sonido;
}

function mostrarBotonNRonda()
{
    const btnRonda = document.getElementById("btnRonda");
    btnRonda.style.display = "inline-block";


}