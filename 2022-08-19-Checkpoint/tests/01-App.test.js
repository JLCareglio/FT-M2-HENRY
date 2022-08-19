import * as data from "../db.json";

import { configure, mount } from "enzyme";


import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import App from "../src/App";
import CreateMovie from "../src/components/CreateMovie/CreateMovie";
import Home from "../src/components/Home/Home";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../src/components/MovieCard/MovieCard";
import MovieDetail from "../src/components/MovieDetail/MovieDetail";
import Nav from "../src/components/Nav/Nav";
import { Provider } from "react-redux";
import React from "react";
import axios from "axios";
import configureStore from "redux-mock-store";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

// Mocks de los componentes, acá se pueden hardcodear para que funcionen SI o SI
// De esa manera sin importar si hay errores en alguno de ellos, nos fijamos de que sean montados en app.js
jest.mock('../src/components/MovieDetail/MovieDetail', () => () => <></>);
jest.mock('../src/components/MovieCard/MovieCard', () => () => <></>);
jest.mock('../src/components/Nav/Nav', () => () => <></>);
jest.mock('../src/components/CreateMovie/CreateMovie', () => () => <></>);
jest.mock('../src/components/Home/Home', () => () => <></>);

describe("<App />", () => {
  global.fetch = nodeFetch;

  let store;
  const routes = ["/", "/movie/1", "/movies/create"];
  const mockStore = configureStore([thunk]);
  const state = {
    movies: data.movies,
    movieDetail: data.movies[0],
  };

  beforeEach(async () => {
    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // "/movies" => Retorna la propiedad movies del archivo data.json
    apiMock.get("/movies").reply(200, data.movies);

    // "/movies/:id" => Retorna una pelicula matcheada por su id
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

  store = mockStore(state);

  const componentToUse = (route) => {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  };
  describe("Nav:", () => {
    it('Debería ser renderizado en la ruta "/"', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(Nav)).toHaveLength(1);
    });

    it('Debería ser renderizado en la ruta "/movie/:id"', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Nav)).toHaveLength(1);
    });
    it('Debería ser renderizado en la ruta "/movies/create"', () => {
      const app = mount(componentToUse(routes[2]));
      expect(app.find(Nav)).toHaveLength(1);
    });
  });

  describe("Home:", () => {
    it('El componente "Home" se debería renderizar solamente en la ruta "/"', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(MovieDetail)).toHaveLength(0);
      expect(app.find(CreateMovie)).toHaveLength(0);
      expect(app.find(Home)).toHaveLength(1);
      // expect(app.find(Nav)).toHaveLength(1);
    });
    it('El componente "Home" no deberia mostrarse en ninguna otra ruta', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(Home)).toHaveLength(1);

      const app2 = mount(componentToUse(routes[1]));
      expect(app2.find(Home)).toHaveLength(0);

      const app3 = mount(componentToUse(routes[2]));
      expect(app3.find(Home)).toHaveLength(0);
    });
  });

  describe("MovieDetail:", () => {
    it('La ruta "/movie/:id" deberia mostrar solo el componente MovieDetail', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Home)).toHaveLength(0);
      expect(app.find(MovieCard)).toHaveLength(0);
      expect(app.find(MovieDetail)).toHaveLength(1);
    });
  });

  describe("CreateMovie:", () => {
    it('La ruta "/movies/create" deberia mostrar solo el componente CreateMovie', () => {
      const app = mount(componentToUse(routes[2]));
      expect(app.find(CreateMovie)).toHaveLength(1);
      expect(app.find(MovieCard)).toHaveLength(0);
      expect(app.find(Nav)).toHaveLength(1);
      expect(app.find(Home)).toHaveLength(0);
    });
  });
});
