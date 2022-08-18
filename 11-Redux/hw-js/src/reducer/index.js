const { INCREMENTO, DECREMENTO } = require("../action-types");

const initialState = {
  contador: 0,
  otraCosa: false,
  isLogged: false,
};

// Nuestro reducer que maneja nuestros dos casos de acción incremento y decremento.
// Recibe el estado de nuestro store, junto con una action creada por nuestro action creator.
// ¿Qué tiene que hacer el reducer con el contador de cada caso?

// reducer recibe 2 parametros EN ORDEN
// 1- ESTADO 2-ACTION QUE LLEGA

// function contador(state=initialState, {type, payload})
function contador(state = initialState, action) {
  switch (action.type) {
    case INCREMENTO:
      return {
        ...state,
        contador: state.contador + action.payload,
        isLogged: true,
      };
    case DECREMENTO:
      return {
        ...state,
        contador: state.contador - action.payload,
        isLogged: false,
      };
    default:
      return state;
  }
}

module.exports = contador;
