import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter } from "react-router-dom";
import * as ReactRedux from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import isReact from "is-react";

import MovieDetail from "../src/components/MovieDetail/MovieDetail";
import * as data from "../db.json";
import * as actions from "../src/redux/actions";
import axios from "axios";
import nock from "nock";
import nodeFetch from "node-fetch";
axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

jest.mock('../src/redux/actions/index', () => ({
  getMovieDetail: () => ({
    type: 'GET_MOVIE_DETAIL'
  })
}));

describe("<MovieDetail />", () => {
  global.fetch = nodeFetch;
  let movieDetail, useSelectorStub, useSelectorFn, useEffect;
  const noProd = {
    id: 1,
    name: "Motherless Brooklyn",
    description:
      "Lionel, a private detective with Tourette syndrome, sets out to uncover the mystery behind his mentor Frank's murder. However, he stumbles upon a larger conspiracy.",
    director: "Edward Norton",
    image: "https://rockandfilms.es/wp-content/uploads/2020/01/111111-2.jpg",
    releaseYear: 2019,
  };

  const match = (id) => ({
    params: { id },
    isExact: true,
    path: "/movies/:id",
    url: `/movies/${id}`,
  });
  const mockStore = configureStore([thunk]);

  const store = (id) => {
    let state = {
      movies: data.movies.concat(noProd),
      movieDetail: id !== 10 ? data.movies[id - 1] : data.movies.concat(noProd),
    };
    return mockStore(state);
  };
  // Si o si vas a tener que usar functional component! No van a correr ninguno de los tests si no lo haces!
  // También fijate que vas a tener que usar algunos hooks. Tanto de React como de Redux!
  // Los hooks de React si o si los tenes que usar "React.useState", "React.useEffect". El test no los reconoce
  // cuando se hace destructuring de estos métodos === test no corren.
  beforeAll(() => expect(isReact.classComponent(MovieDetail)).toBeFalsy());
  const mockUseEffect = () => useEffect.mockImplementation((fn) => fn());

  beforeEach(() => {
    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // "/movies" => Retorna la propiedad movies del archivo data.json
    apiMock.get("/movies").reply(200, data.movies);

    // "/movies/:id" => Retorna una movie matcheada por su id

    let id = null;
    apiMock
      .get((uri) => {
        id = Number(uri.split("/").pop()); // Number('undefined') => NaN
        return !!id;
      })
      .reply(200, (uri, requestBody) => {
        return data.movies.find((movie) => movie.id === id) || {};
      });
    useSelectorStub = jest.spyOn(ReactRedux, "useSelector");
    useSelectorFn = (id) =>
      useSelectorStub.mockReturnValue(store(id).getState().movieDetail);
    useEffect = jest.spyOn(React, "useEffect");
    movieDetail = (id) =>
      mount(
        <ReactRedux.Provider store={store(id)}>
          <MemoryRouter initialEntries={[`/movies/${id}`]}>
            <MovieDetail match={match(id)} />
          </MemoryRouter>
        </ReactRedux.Provider>
      );
    mockUseEffect();
    mockUseEffect();
  });

  afterEach(() => jest.restoreAllMocks());

    // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA🚨
    // import * as actions from "./../../redux/actions/index";


  it("Debería usar un useEffect y dentro de este, dispachar la acción getMovieDetail, pasandole como argumento el ID de la movie a renderizar", async () => {
    // Nuevamente testeamos todo el proceso. Tenes que usar un useEffect, y despachar la acción "getMovieDetail".
    const useDispatch = jest.spyOn(ReactRedux, "useDispatch");
    const getMovieDetail = jest.spyOn(actions, "getMovieDetail");
    movieDetail(1);
    expect(useEffect).toHaveBeenCalled();
    expect(useDispatch).toHaveBeenCalled();
    expect(getMovieDetail).toHaveBeenCalled();

    movieDetail(2);
    expect(useEffect).toHaveBeenCalled();
    expect(useDispatch).toHaveBeenCalled();
    expect(getMovieDetail).toHaveBeenCalled();
  });

  describe('Debería recibir por props el objeto "match". Utilizar el "id" de "params" para despachar la action "getMovieDetail" y renderizar los detalles de la pelicula', () => {
    const movie = data.movies[0];

    // Fijate que para traerte los datos desde Redux, vas a tener que usar el hook de Redux "useSelector"
    // para que los tests pasen!
    // Lo que se esta testeando aca, es que el componente renderice los detalles del todo correctamente,
    // no la estructura del componente asi que eres libre de diseñar la estructura, siempre y cuando se muestren los datos del todo.
    // Verificar la llegada de datos en el objeto "match.params", puede romper en el caso que no exista nada.
    it("Deberia renderizar el name de la pelicula.", () => {
      useSelectorFn(1);
      expect(movieDetail(1).text().includes(movie.name)).toEqual(true);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
    it("Deberia rederizar el director de la pelicula.", () => {
      useSelectorFn(1);
      expect(movieDetail(1).text().includes(movie.director)).toEqual(true);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
    it("Deberia renderizar la descripción de la pelicula.", () => {
      useSelectorFn(1);
      expect(movieDetail(1).text().includes(movie.description)).toEqual(true);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
    it("Deberia renderizar el releaseYear de la pelicula.", () => {
      useSelectorFn(1);
      expect(movieDetail(1).text().includes(movie.releaseYear)).toEqual(true);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
  });
});
