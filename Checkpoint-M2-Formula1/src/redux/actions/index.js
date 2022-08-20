// Fijarse que la sintaxis de nuestra Action creator es distinta a lo que venimos haciendo. Esto es
// debido al uso del middleware "thunk", el cual nos permite trabajar con acciones asincrónicas.
// Necesitamos hacer uso de este middleware ya que nuestras peticiones al back siempre son asincrónicas,
// por lo tanto, necesitamos ese "delay" para despachar nuestra action hasta que la data nos llegue.
// Vas a tener que usar la funcion "dispatch" recibida en la funcion interna para despachar la action que
// va a llegar a nuestro reducer.
// Acá pueden ver un poco mejor la explicación y algunos ejemplos: https://github.com/reduxjs/redux-thunk

// Usar ruta 'http://localhost:3001/teams' para buscar todas los teams en nuestro back.
// Esto lo vas a poder hacer utilizando fetch.
// export const getAllTeams = () => dispatch => {};

export const getAllTeams = () => (dispatch) => {
  // Tu código acá
  
};

// Usar ruta 'http://localhost:3001/teams/:id' para buscar un team por el id pasado
// como parámetro de la action creator.
// Donde :id, el id recibido como argumento de la action creator.
// Ojo, hacer un console.log de la respuesta desde el back. En nuestro reducer esperamos un objeto;
// export const getTeam = () => dispatch => {};
export const getTeam = (id) => (dispatch) => {
  // Tu código acá

};

// Inicializamos id en 5, para que nuestros próximos ID's no se pisen con los existentes.
// La vas a usar en la funcion createTeam, descomentala cuando te haga falta;



// Desde el componente ejecutamos la action creator, pasandole como argumento los values que vamos a utilizar para crear un team.
export const createTeam = (team) => {
  // Tu código acá
 
};

// Desde el componente ejecutamos la action creator, pasandole como argumento el id del team que queremos eliminar.
export const deleteTeam = (id) => {
  // Tu código acá
  
};
