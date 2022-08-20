// Aca deben declarar las variables donde tengan el action types.
export const GET_ALL_MOVIES = "GET_ALL_MOVIES";
export const GET_MOVIE_DETAILS = "GET_MOVIE_DETAILS";
export const CREATE_MOVIE = "CREATE_MOVIE";
export const DELETE_MOVIE = "DELETE_MOVIE";
export const SEND_EMAIL = "SENT_EMAIL";

// Esten atentos a que los nombres de las variables coincidan.

// Fijarse que la sintaxis de nuestra Action creator es distinta a lo que venimos haciendo. Esto es
// debido al uso del middleware "thunk", el cual nos permite trabajar con acciones asincrónicas.
// Necesitamos hacer uso de este middleware ya que nuestras peticiones al back siempre son asincrónicas,
// por lo tanto, necesitamos ese "delay" para despachar nuestra action hasta que la data nos llegue.
// Vas a tener que usar la funcion "dispatch" recibida en la funcion interna para despachar la action que
// va a llegar a nuestro reducer.
// Acá pueden ver un poco mejor la explicación y algunos ejemplos: https://github.com/reduxjs/redux-thunk
//
// NOTA:
//      Para obtener la informacion del detalle recorda utilizar la ruta http://localhost:3001/movies/:id
//      Usar ruta 'http://localhost:3001/movies' para buscar todas las movies en nuestro back.

// Inicializamos id en 6, para que nuestros próximos ID's no se pisen con los existentes.
// La vas a usar en la funcion createMovie, descomentala cuando te haga falta;
let id = 6;
// Desde el componente ejecutamos la action creator, pasandole como argumento los values que vamos a utilizar para crear la movie.
// Puedes usar spread operator para copiar el objeto payload.

// 🚨 IMPORTANTE SI USAN PROMESAS HAY QUE RETORNARLAS! LOS TESTS PUEDEN FALLAR SI NO LO HACEN 🚨

export const getAllMovies = () => {
  return (dispatch) => {
    return fetch("http://localhost:3001/movies")
      .then((response) => response.json())
      .then((json) => dispatch({ type: GET_ALL_MOVIES, payload: json }));
  };
};

export const getMovieDetail = (movieID) => {
  return function (dispatch) {
    return fetch(`http://localhost:3001/movies/${movieID}`)
      .then((response) => response.json())
      .then((json) => dispatch({ type: GET_MOVIE_DETAILS, payload: json }));
  };
};

export const createMovie = (payload) => {
  return { type: CREATE_MOVIE, payload: { ...payload, id: id++ } };
};

// Desde el componente ejecutamos la action creator, pasandole como argumento el id de la movie que queremos eliminar.
export const deleteMovie = (movieID) => {
  return { type: DELETE_MOVIE, payload: movieID };
};

// Desde el componente ejecutamos la action creator, pasandole como argumento los values que vamos a utilizar para enviar el form de contacto.
export const sendEmail = (formValues) => {
  return { type: SEND_EMAIL, payload: formValues };
};
