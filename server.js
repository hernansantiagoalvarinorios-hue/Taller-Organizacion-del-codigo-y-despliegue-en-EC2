const http = require('http');

// ---------- Constantes (ningún número suelto) ----------
const PUERTO = 80;
const NOTA_MINIMA = 3.0; // promedio mínimo para aprobar
const CONTENT_TYPE_JSON = 'application/json; charset=utf-8';
const HTTP = { OK: 200, NO_ENCONTRADO: 404 };

// ---------- Datos: de dónde salen las notas y el equipo ----------
const notasDelCurso = [4.5, 3.5, 2.5, 4.0];
const datosDelEquipo = {
  equipo: 'Equipo NN',
  integrantes: ['Hernán Santiago Alvarino Rios'],
};

// ---------- Lógica: las reglas, sin saber nada de HTTP ----------
function calcularPromedio(notas) {
  return notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
}

function estaAprobado(promedio) {
  return promedio >= NOTA_MINIMA;
}

function resumirNotas(notas) {
  const promedio = calcularPromedio(notas);
  return { promedio, aprobado: estaAprobado(promedio) };
}

// ---------- Presentación: recibe la petición y entrega la respuesta ----------
function responder(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': CONTENT_TYPE_JSON });
  res.end(JSON.stringify(datos, null, 2));
}

const rutas = {
  '/salud': (res) => responder(res, HTTP.OK, { estado: 'ok' }),
  '/equipo': (res) => responder(res, HTTP.OK, datosDelEquipo),
  '/notas': (res) => responder(res, HTTP.OK, resumirNotas(notasDelCurso)),
};

function manejarPeticion(req, res) {
  const manejador = rutas[req.url];
  if (manejador) {
    manejador(res);
  } else {
    responder(res, HTTP.NO_ENCONTRADO, { error: 'Ruta no encontrada' });
  }
}

const servidor = http.createServer(manejarPeticion);
servidor.listen(PUERTO);
