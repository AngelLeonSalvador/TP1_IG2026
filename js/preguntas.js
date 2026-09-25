//CAPTURA DE ELEMENTOS EN PREGUNTAS-CONFIGURACION
const btnClasico = document.querySelector("#btn-clasico");
const btnContrarreloj = document.querySelector("#btn-contrarreloj");
const btnInstrucciones = document.querySelector("#btn-instrucciones");
const btnCreditos = document.querySelector("#btn-creditos");
const configuracion = document.querySelector("#preguntas-configuracion");

//CAPTURA ELEMENTOS PREGUNTAS-JUEGO
const pantallaJuego = document.querySelector("#preguntas-juego");
const pregunta = document.querySelector("#pregunta");
const respuestas = document.querySelector("#respuestas");
const numeroPregunta = document.querySelector("#nro-pregunta");
const mensaje = document.querySelector("#mensaje");
const mensajeResultado = document.querySelector("#msj-resultado");
const puntosElemento = document.querySelector("#puntos");
const vidasElemento = document.querySelector("#vidas");
const rachaElemento = document.querySelector("#racha");

// CAPTURA DE ELEMENTOS EN MODO CLÁSICO

const configuracionClasico = document.querySelector("#clasico-config");
const btnComenzarClasico = document.querySelector("#btn-comenzarClasico");
const tiempoJuego = document.querySelector("#tiempo-partida");

// CAPTURA DE ELEMENTOS EN PREGUNTAS-FIN
const final = document.querySelector("#preguntas-fin");
const resultadoFinal = document.querySelector("#resultado-final");
const puntajeFinal = document.querySelector("#puntaje-final");
const btnNuevaPartida = document.querySelector("#btn-nueva");

//INICIALIZACIÓN
let preguntas = [];
let preguntaActual = 0;
let puntos = 0;
let vidas = 3;
let racha = 0;
let tiempoRestante = 120;
let temporizador;

async function iniciarPartida() {
  preguntaActual = 0;
  puntos = 0;
  vidas = 3;
  racha = 0;
  tiempoRestante = 120;
  actualizarInterfaz();
  preguntas = [];
  const preguntaJuego = await obtenerPregunta();
  preguntas.push(preguntaJuego);
  mostrarPregunta();
  iniciarTemporizador();
  const preguntasEasy = await obtenerPreguntas(4, "easy");

  console.log(preguntasEasy);
}

function actualizarInterfaz() {
  puntosElemento.textContent = "Puntos: " + puntos;
  vidasElemento.textContent = "Vidas: " + vidas;
  rachaElemento.textContent = "Racha: " + racha;
  tiempoJuego.textContent = "Tiempo: " + tiempoRestante;
}

function iniciarTemporizador() {
  temporizador = setInterval(function () {
    tiempoRestante--;
    tiempoElemento.textContent = "Tiempo: " + tiempoRestante;
    if (tiempoRestante === 0) {
      terminarPartida();
    }
  }, 1000);
}

function mostrarPregunta() {
  const preguntaActualTexto = preguntas[preguntaActual];
  pregunta.textContent = preguntaActualTexto.pregunta;
  numeroPregunta.textContent = "Pregunta: " + (preguntaActual + 1);
  respuestas.replaceChildren();
  preguntaActualTexto.respuestas.forEach(function (respuesta) {
    const boton = document.createElement("button");
    boton.textContent = respuesta;
    boton.addEventListener("click", function () {
      comprobarRespuesta(respuesta);
    });
    respuestas.append(boton);
  });
}

function comprobarRespuesta(respuestaSeleccionada) {
  const botones = respuestas.querySelectorAll("button");
  botones.forEach(function (boton) {
    boton.disabled = true;
  });
  const preguntaActualTexto = preguntas[preguntaActual];
  if (respuestaSeleccionada === preguntaActualTexto.correcta) {
    racha++;
    puntos += racha * 100;
    mensajeResultado.textContent = "Correcto!" + racha * 100 + " puntos";
  } else {
    vidas--;
    racha = 0;
    mensajeResultado.textContent = "Incorrecto. Perdiste una vida";
  }
  actualizarInterfaz();
  setTimeout(function () {
    if (vidas === 0) {
      terminarPartida();
    } else if (preguntaActual < preguntasPrueba.length - 1) {
      preguntaActual++;
      mostrarPregunta();
    } else {
      terminarPartida();
    }
  }, 1000);
}

//API

function adaptarPregunta(preguntaAPI) {
  const respuestas = preguntaAPI.incorrect_answers.concat(
    preguntaAPI.correct_answer,
  );
  return {
    pregunta: preguntaAPI.question,
    respuestas: respuestas,
    correcta: preguntaAPI.correct_answer,
  };
}

async function obtenerPreguntas(cantidad, dificultad) {
  const url = `https://opentdb.com/api.php?amount=${cantidad}&difficulty=${dificultad}&type=multiple`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  const preguntasObtenidas = [];
  datos.results.forEach(function (preguntaAPI) {
    const preguntaJuego = adaptarPregunta(preguntaAPI);

    preguntasObtenidas.push(preguntaJuego);
  });
  return preguntasObtenidas;
}

//MODO CLÁSICO

btnComenzarClasico.addEventListener("click", function () {
  configuracionClasico.classList.add("oculto");
  pantallaJuego.classList.remove("oculto");
  iniciarPartida();
});

//MODO CONTRARRELOJ
btnContrarreloj.addEventListener("click", function () {
  mensaje.textContent = "Seleccionaste el modo Contrarreloj.";
});

//NUEVA PARTIDA
btnNuevaPartida.addEventListener("click", function () {
  final.classList.add("oculto");
  pantallaJuego.classList.remove("oculto");
  iniciarPartida();
});

//MODO RIESGO

let puntosOriginales = 0;
let porcentajeApuesta = 0;
let puntosApostados = 0;
let preguntasRiesgo = [];
let preguntaRiesgoActual = 0;
let aciertosRiesgo = 0;

// FINALIZACIÓN

function terminarPartida() {
  clearInterval(temporizador);
  pantallaJuego.classList.add("oculto");
  final.classList.remove("oculto");
  resultadoFinal.textContent = "Partida terminada";
  puntajeFinal.textContent = "Puntaje final: " + puntos;
}

//PUNTAJE FINAL
