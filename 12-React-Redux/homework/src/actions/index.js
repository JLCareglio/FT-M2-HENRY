export const getMovies = (titulo) => {
  return (dispatch) => {
    return fetch("http://www.omdbapi.com/?apikey=283c32e7&s=" + titulo)
      .then((response) => response.json())
      .then((json) => dispatch({ type: "GET_MOVIES", payload: json }));
  };
};
export const getMovieDetail = (movieID) => {
  return function (dispatch) {
    return fetch(`http://www.omdbapi.com/?apikey=283c32e7&i=${movieID}`)
      .then((response) => response.json())
      .then((json) => dispatch({ type: "GET_MOVIES_DETAIL", payload: json }));
  };
};

export const addMovieFavorite = (payload) => {
  return { type: "ADD_MOVIE_FAVORITE", payload };
};
export const removeMovieFavorite = (movieID) => {
  return { type: "REMOVE_MOVIE_FAVORITE", payload: movieID };
};
