// Importa las action types acá
import {
  GET_ALL_MOVIES,
  GET_MOVIE_DETAILS,
  CREATE_MOVIE,
  DELETE_MOVIE,
  SEND_EMAIL,
} from "../actions";

const initialState = {
  movies: [],
  movieDetail: {},
  email: {},
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MOVIES:
      return {
        ...state,
        movies: action.payload,
      };
    case GET_MOVIE_DETAILS:
      return {
        ...state,
        movieDetail: action.payload,
      };
    case CREATE_MOVIE:
      return {
        ...state,
        movies: Array.from(new Set([...state.movies, action.payload])),
      };
    case DELETE_MOVIE:
      return {
        ...state,
        movies: state.movies.filter((movie) => movie.id !== action.payload),
      };
    case SEND_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    default:
      return { ...initialState };
  }
};

export default rootReducer;
