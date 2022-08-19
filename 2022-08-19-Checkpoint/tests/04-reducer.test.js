import rootReducer from "../src/redux/reducer";
import {
  createMovie,
  deleteMovie,
  GET_ALL_MOVIES,
  GET_MOVIE_DETAILS,
  SEND_EMAIL,
} from "../src/redux/actions";
import * as data from "../db.json";

// Acá se mockean las actions para que el test pueda funcionar correctamente, sin importar si hay un bug en ese archivo
jest.mock('../src/redux/actions', () => ({
  __esmodules: true,
  GET_ALL_MOVIES: 'GET_ALL_MOVIES',
  DELETE_MOVIE: 'DELETE_MOVIE',
  GET_MOVIE_DETAILS: 'GET_MOVIE_DETAILS',
  SEND_EMAIL: 'SEND_EMAIL',
  CREATE_MOVIE: 'CREATE_MOVIE',
  createMovie: (payload) => ({
    type: "CREATE_MOVIE",
    payload
  }),
  deleteMovie: (payload) => ({
    type: "DELETE_MOVIE",
    payload
  }),
  getMovieDetail: (payload) => ({
    type: 'GET_MOVIE_DETAILS',
    payload
  }) 
}));

describe("Reducer", () => {
  const state = {
    movies: [],
    movieDetail: {},
    email: {},
  };

  it("Debería retornar el estado inicial si no se pasa un type válido", () => {
    expect(rootReducer(undefined, [])).toEqual({
      movies: [],
      movieDetail: {},
      email: {},
    });
  });

  it('Debería guardar en nuestro state las peliculas obtenidos de nuestro llamado al back cuando action type es "GET_ALL_MOVIES"', () => {
    const result = rootReducer(state, {
      type: GET_ALL_MOVIES,
      payload: data.movies,
    });
    // Acuerdense que el state inicial no tiene que mutar!
    expect(result).not.toEqual(state);
    expect(result).toEqual({
      movies: data.movies, // Cuando ejecutes los tests, vas a ver bien lo que espera que le llegue a nuestro estado!
      movieDetail: {},
      email: {},
    });
  });

  it('Debería guardar en nuestro state la pelicula obtenido de nuestro llamado al back cuando action type es "GET_MOVIE_DETAILS"', () => {
    const result = rootReducer(state, {
      type: GET_MOVIE_DETAILS,
      payload: data.movies[0],
    });
    // Acuerdense que el state inicial no tiene que mutar!
    expect(result).not.toEqual(state);
    expect(result).toEqual({
      movies: [],
      movieDetail: data.movies[0],
      email: {},
    });
  });

  it('Debería crear una nueva pelicula y guardarla en nuestro estado de "movies" cuando action type es "CREATE_MOVIE"', () => {
    const state = {
      movies: data.movies,
      movieDetail: {},
      email: {},
    };

    const payload1 = {
      id: 6,
      name: "GoodFellas",
      director: "Martin Scorsese",
      releaseYear: 1990,
      description:
        "Young Henry Hill, with his friends Jimmy and Tommy, begins the climb from being a petty criminal to a gangster on the mean streets of New York.",
      image:
        "https://pics.filmaffinity.com/Uno_de_los_nuestros-657659084-large.jpg",
      runningTime: 146,
    };

    const payload2 = {
      id: 7,
      name: "Boyhood",
      director: "Richard Linklater",
      releaseYear: 2014,
      description:
        "After MJ's parents' divorce, he and his sister Samantha live with their mother, whereas the father has visiting rights. Incidents that occur across a period of twelve years mould MJ's life.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/a/a6/Boyhood_%282014%29.png",
      runningTime: 165,
    };

    const allMoviesType1 = [
      ...data.movies,
      {
        id: 6,
        name: "GoodFellas",
        director: "Martin Scorsese",
        releaseYear: 1990,
        description:
          "Young Henry Hill, with his friends Jimmy and Tommy, begins the climb from being a petty criminal to a gangster on the mean streets of New York.",
        image:
          "https://pics.filmaffinity.com/Uno_de_los_nuestros-657659084-large.jpg",
        runningTime: 146,
      },
    ];
    const allMoviesType2 = [
      ...allMoviesType1,
      {
        id: 7,
        name: "Boyhood",
        director: "Richard Linklater",
        releaseYear: 2014,
        description:
          "After MJ's parents' divorce, he and his sister Samantha live with their mother, whereas the father has visiting rights. Incidents that occur across a period of twelve years mould MJ's life.",
        image:
          "https://upload.wikimedia.org/wikipedia/en/a/a6/Boyhood_%282014%29.png",
        runningTime: 165,
      },
    ];
    const firstMovie = rootReducer(state, createMovie(payload1));
    const secondMovie = rootReducer(
      { ...state, movies: allMoviesType1 },
      createMovie(payload2)
    );

    // Acuerdense que el state inicial no tiene que mutar!
    expect(firstMovie).not.toEqual(state);
    expect(secondMovie).not.toEqual(state);

    expect(firstMovie).toEqual({
      movieDetail: {},
      movies: allMoviesType1,
      email: {},
    });
    expect(secondMovie).toEqual({
      movieDetail: {},
      movies: allMoviesType2,
      email: {},
    });
  });

  it('Debería eliminar una pelicula de nuestro store cuando action type es "DELETE_MOVIE"', () => {
    // Caso 1
    const payload = 1;
    const state = {
      movies: [
        {
          id: 1,
          name: "GoodFellas",
          director: "Martin Scorsese",
          releaseYear: 1990,
          description:
            "Young Henry Hill, with his friends Jimmy and Tommy, begins the climb from being a petty criminal to a gangster on the mean streets of New York.",
          image:
            "https://pics.filmaffinity.com/Uno_de_los_nuestros-657659084-large.jpg",
          runningTime: 146,
        },
      ],
      movieDetail: {},
      email: {},
    };

    expect(rootReducer(state, deleteMovie(payload))).toEqual({
      movies: [],
      movieDetail: {},
      email: {},
    });

    //Caso 2
    const payload2 = 6;
    const state2 = {
      movies: [
        {
          id: 6,
          name: "GoodFellas",
          director: "Martin Scorsese",
          releaseYear: 1990,
          description:
            "Young Henry Hill, with his friends Jimmy and Tommy, begins the climb from being a petty criminal to a gangster on the mean streets of New York.",
          image:
            "https://pics.filmaffinity.com/Uno_de_los_nuestros-657659084-large.jpg",
          runningTime: 146,
        },
        {
          id: 7,
          name: "Boyhood",
          director: "Richard Linklater",
          releaseYear: 2014,
          description:
            "After MJ's parents' divorce, he and his sister Samantha live with their mother, whereas the father has visiting rights. Incidents that occur across a period of twelve years mould MJ's life.",
          image:
            "https://upload.wikimedia.org/wikipedia/en/a/a6/Boyhood_%282014%29.png",
          runningTime: 165,
        },
      ],
      movieDetail: {},
      email: {},
    };

    expect(rootReducer(state2, deleteMovie(payload2))).toEqual({
      movies: [
        {
          id: 7,
          name: "Boyhood",
          director: "Richard Linklater",
          releaseYear: 2014,
          description:
            "After MJ's parents' divorce, he and his sister Samantha live with their mother, whereas the father has visiting rights. Incidents that occur across a period of twelve years mould MJ's life.",
          image:
            "https://upload.wikimedia.org/wikipedia/en/a/a6/Boyhood_%282014%29.png",
          runningTime: 165,
        },
      ],
      movieDetail: {},
      email: {},
    });
  });

  it('Debería guardar en nuestro state "email" la informacion que viene del payload cuando action type es "SEND_EMAIL"', () => {
    const payload = {
      email: "toni@soyhenry.com",
      name: "Toni",
      message: "Hola, soy Toni",
    };

    const result = rootReducer(state, {
      type: SEND_EMAIL,
      payload: payload,
    });
    // Acuerdense que el state inicial no tiene que mutar!
    expect(result).not.toEqual(state);
    expect(result).toEqual({
      movies: [],
      movieDetail: {},
      email: payload,
    });
  });
});
