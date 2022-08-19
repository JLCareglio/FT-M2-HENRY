const initialState = {
  moviesFavorites: [],
  moviesLoaded: [],
  movieDetail: {},
};
export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_MOVIE_FAVORITE":
      return {
        ...state,
        moviesFavorites: Array.from(
          new Set([...state.moviesFavorites, action.payload])
        ),
      };
    case "REMOVE_MOVIE_FAVORITE":
      return {
        ...state,
        moviesFavorites: state.moviesFavorites.filter(
          (pelicula) => pelicula.imdbID !== action.payload
        ),
      };
    case "GET_MOVIES":
      return {
        ...state,
        moviesLoaded: action.payload.Search,
      };
    case "GET_MOVIES_DETAIL":
      return {
        ...state,
        movieDetail: action.payload,
      };
    default:
      return { ...state };
  }
}
