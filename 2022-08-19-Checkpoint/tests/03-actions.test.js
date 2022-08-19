/* eslint-disable jest/no-conditional-expect */

import * as data from "../db.json";

import {
  CREATE_MOVIE,
  DELETE_MOVIE,
  GET_ALL_MOVIES,
  GET_MOVIE_DETAILS,
  SEND_EMAIL,
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieDetail,
  sendEmail,
} from "../src/redux/actions";

import axios from "axios";
import configureStore from "redux-mock-store";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

axios.defaults.adapter = require("axios/lib/adapters/http");

describe("Actions", () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({ movies: [] });
  global.fetch = nodeFetch;
  beforeEach(() => {
    store.clearActions();

    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // "/movies" => Retorna la propiedad movies del archivo data.json
    apiMock.get("/movies").reply(200, data.movies);

    // "/movies/:id" => Retorna una pelicula matcheado por su id
    let id = null;
    apiMock
      .get((uri) => {
        id = Number(uri.split("/").pop()); // Number('undefined') => NaN
        return !!id;
      })
      .reply(200, (uri, requestBody) => {
        return data.movies.find((movie) => movie.id === id) || {};
      });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe("getAllMovies", () => {
    it("Debería hacer un dispatch con las propiedades type GET_ALL_MOVIES y como payload, el resultado del fetch al link provisto", async () => {
      return store
        .dispatch(getAllMovies())
        .then(() => {
          const actions = store.getActions();
          expect(actions[0].payload.length).toBe(5);
          expect(actions[0]).toEqual({
            type: GET_ALL_MOVIES,
            payload: data.movies,
          });
        })
        .catch((err) => {
          // En caso de que haya un error al mandar la petición al back, el error entrara aquí. Podrás visualizarlo en la consola.

          console.error(err);
          expect(err).toBeUndefined();
        });
    });
  });

  describe("getMovieDetail", () => {
    it("Debería hacer un dispatch con las propiedades type GET_MOVIE_DETAILS y como payload, el resultado del fetch al link provisto", async () => {
      const payload = data.movies[0];
      return store
        .dispatch(getMovieDetail(payload.id))
        .then(() => {
          const actions = store.getActions();
          expect(actions[0]).toStrictEqual({
            type: GET_MOVIE_DETAILS,
            payload: { ...payload },
          });
        })
        .catch((err) => {
          // El catch lo utilizamos para "agarrar" cualquier tipo de errores a la hora de hacer la petición al back. Solo va a entrar si el test no sale como es pedido.
          // Para ver que está pasando deberías revisar la consola.
          console.error(err);
          expect(err).toBeUndefined();
        });
    });

    it("Debería traer una pelicula distinta si el id requerido es otro (evitar hardcodeos)", async () => {
      const payload = data.movies[1];
      return store
        .dispatch(getMovieDetail(payload.id))
        .then(() => {
          const actions = store.getActions();
          expect(actions[0]).toStrictEqual({
            type: GET_MOVIE_DETAILS,
            payload: { ...payload },
          });
        })
        .catch((err) => {
          // El catch lo utilizamos para "agarrar" cualquier tipo de errores a la hora de hacer la petición al back. Solo va a entrar si el test no sale como es pedido.
          // Para ver que está pasando deberías revisar la consola.
          console.error(err);
          expect(err).toBeUndefined();
        });
    });
  });

  describe("createMovie", () => {
    it('Debería retornar una action con las propiedades type CREATE_MOVIE y payload: contiene los values recibidos como argumento y un ID incremental en la action "createMovie"', () => {
      // Para que este test pase, deberan declarar una variable id que su valor inicialice en 6. Lo hacemos para que no haya conflicto entre los id's que nosotros ya tenemos.
      // Si revisan el archivo db.json verán la lista de peliculas.
      const payload1 = {
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
        name: "Boyhood",
        director: "Richard Linklater",
        releaseYear: 2014,
        description:
          "After MJ's parents' divorce, he and his sister Samantha live with their mother, whereas the father has visiting rights. Incidents that occur across a period of twelve years mould MJ's life.",
        image:
          "https://upload.wikimedia.org/wikipedia/en/a/a6/Boyhood_%282014%29.png",
        runningTime: 165,
      };

      expect(createMovie(payload1)).toEqual({
        type: CREATE_MOVIE,
        payload: {
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
      });

      expect(createMovie(payload2)).toEqual({
        type: "CREATE_MOVIE",
        payload: {
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
      });
    });
  });

  describe("deleteMovie", () => {
    it("Debería retornar una action con las propiedades type DELETE_MOVIE y como payload el id de la pelicula a eliminar. Recibe el id por argumento", () => {
      expect(deleteMovie(1)).toEqual({ type: DELETE_MOVIE, payload: 1 });
      expect(deleteMovie(2)).toEqual({ type: DELETE_MOVIE, payload: 2 });
    });
  });
});

describe("sendEmail", () => {
  const payload1 = {
    name: "Toni Tralice",
    email: "toni@soyhenry.com",
    message: "Hola, soy una prueba",
  };

  const payload2 = {
    name: "Franco Etcheverry",
    email: "franco@soyhenry.com",
    message: "Hola, quiero una cita",
  };
  it("Debería retornar una action con las propiedades type SEND_EMAIL y como payload los valores del formulario que viene del componente About", () => {
    expect(sendEmail(payload1)).toEqual({
      type: SEND_EMAIL,
      payload: payload1,
    });
    expect(sendEmail(payload2)).toEqual({
      type: SEND_EMAIL,
      payload: payload2,
    });
  });
});
