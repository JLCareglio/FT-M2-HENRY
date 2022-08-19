import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import CreateMovie from "../src/components/CreateMovie/CreateMovie";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import thunk from "redux-thunk";

configure({ adapter: new Adapter() });

jest.mock('../src/redux/actions/index', () => ({
  CREATE_MOVIE: "CREATE_MOVIE",
  createMovie: (payload) => ({
    type: 'CREATE_MOVIE',
    payload: {
      ...payload,
      id: 6
    }
  })
}))

describe("<CreateMovie/>", () => {
  const state = { movies: data.movies };
  const mockStore = configureStore([thunk]);
  const { CREATE_MOVIE } = actions;

  beforeAll(() => expect(isReact.classComponent(CreateMovie)).toBeFalsy());

  // RECUERDEN USAR FUNCTIONAL COMPONENT EN LUGAR DE CLASS COMPONENT
  describe("Formulario de Creación de Pelicula", () => {
    let createMovie;
    let store = mockStore(state);
    beforeEach(() => {
      createMovie = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/movies/create"]}>
            <CreateMovie />
          </MemoryRouter>
        </Provider>
      );
    });

    it("Debe renderizar un formulario", () => {
      expect(createMovie.find("form").length).toBe(1);
    });

    it('Debe renderizar un label para el nombre con el texto "Name: "', () => {
      expect(createMovie.find("label").at(0).text()).toEqual("Name: ");
    });

    it('Debe renderizar un input de tipo text para con la propiedad "name" igual a "name"', () => {
      expect(createMovie.find('input[name="name"]').length).toBe(1);
    });

    it('Debe renderizar un label para el año de lanzamiento con el texto "ReleaseYear:', () => {
      expect(createMovie.find("label").at(1).text()).toBe("ReleaseYear: ");
    });

    it('Debe renderizar un input de tipo number para con la propiedad "name" igual a "releaseYear"', () => {
      expect(createMovie.find('input[name="releaseYear"]').length).toBe(1);
      expect(createMovie.find('input[type="number"]').length).toBe(1);
    });
    it('Debe renderizar un label para la descripción con el texto "Description:', () => {
      expect(createMovie.find("label").at(2).text()).toBe("Description: ");
    });
    it('Debe renderizar un textarea con la propiedad name igual a "description"', () => {
      expect(createMovie.find('textarea[name="description"]').length).toBe(1);
    });

    it('Debe renderizar in label para el director con el texto "Director: "', () => {
      expect(createMovie.find("label").at(3).text()).toEqual("Director: ");
    });
    it('Debe renderizar un input de tipo text para con la propiedad "name" igual a "director', () => {
      expect(createMovie.find('input[name="director"]').length).toBe(1);
      expect(createMovie.find('input[type="text"]').length).toBe(2);
    });

    it('Debería renderizar un input de button submit y con texto "Create Movie"', () => {
      expect(createMovie.find('button[type="submit"]').length).toBe(1);
      expect(createMovie.find('button[type="submit"]').text()).toBe(
        "Create Movie"
      );
    });
  });

  describe("Manejo de estados locales", () => {
    let useState, useStateSpy, createMovie;
    let store = mockStore(state);
    beforeEach(() => {
      useState = jest.fn();
      useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation((initialState) => [
        initialState,
        useState,
      ]);

      createMovie = mount(
        <Provider store={store}>
          <CreateMovie />
        </Provider>
      );
    });

    // Revisen bien que tipo de dato utilizamos en cada propiedad.
    it("Deberia inicializar de forma correcta los valores del useState", () => {
      expect(useStateSpy).toHaveBeenCalledWith({
        name: "",
        releaseYear: 0,
        description: "",
        director: "",
      });
    });

    describe("Name input", () => {
      it('Debe reconocer cuando hay un cambio en el valor del input "name"', () => {
        createMovie.find('input[name="name"]').simulate("change", {
          target: { name: "name", value: "El gladiador" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "El gladiador",
          releaseYear: 0,
          description: "",
          director: "",
        });

        createMovie.find('input[name="name"]').simulate("change", {
          target: { name: "name", value: "Candy man" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "Candy man",
          releaseYear: 0,
          description: "",
          director: "",
        });
      });
    });

    describe("ReleaseYear input", () => {
      it('Debe reconocer cuando hay un cambio en el valor del input "releaseYear"', () => {
        createMovie.find('input[name="releaseYear"]').simulate("change", {
          target: { name: "releaseYear", value: 100 },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          releaseYear: 100,
          description: "",
          director: "",
        });

        createMovie.find('input[name="releaseYear"]').simulate("change", {
          target: { name: "releaseYear", value: 200 },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          releaseYear: 200,
          description: "",
          director: "",
        });
      });
    });

    describe("Description input", () => {
      it('Debe reconocer cuando hay un cambio en el valor del input "description"', () => {
        createMovie.find('textarea[name="description"]').simulate("change", {
          target: { name: "description", value: "Descripcion" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          releaseYear: 0,
          description: "Descripcion",
          director: "",
        });

        createMovie.find('textarea[name="description"]').simulate("change", {
          target: { name: "description", value: "Descripcion 2" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          releaseYear: 0,
          description: "Descripcion 2",
          director: "",
        });
      });
    });

    describe("Director input", () => {
      it('Debe reconocer cuando hay un cambio en el valor del input "director"', () => {
        createMovie.find('input[name="director"]').simulate("change", {
          target: { name: "director", value: "lucas film" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          releaseYear: 0,
          description: "",
          director: "lucas film",
        });

        createMovie.find('input[name="director"]').simulate("change", {
          target: { name: "director", value: "tom cruise" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          releaseYear: 0,
          description: "",
          director: "tom cruise",
        });
      });
    });
  });

  describe("Dispatch al store", () => {
    // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA🚨
    // import * as actions from "./../../redux/actions/index";

    let createMovie, useState, useStateSpy;
    let store = mockStore(state);

    beforeEach(() => {
      useState = jest.fn();
      useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation((initialState) => [
        initialState,
        useState,
      ]);
      store = mockStore(state, actions.createMovie);
      store.clearActions();
      createMovie = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/movies/create"]}>
            <CreateMovie />
          </MemoryRouter>
        </Provider>
      );
    });

    afterEach(() => jest.restoreAllMocks());

    it("Debe disparar la acción createMovie con los datos del state cuando se haga submit del form.", () => {
      const createMovieFn = jest.spyOn(actions, "createMovie");
      createMovie.find("form").simulate("submit");
      expect(store.getActions()).toEqual([
        {
          type: CREATE_MOVIE,
          payload: {
            name: "",
            releaseYear: 0,
            description: "",
            director: "",
            id: 6,
          },
        },
      ]);
      expect(CreateMovie.toString().includes("useDispatch")).toBe(true);
      expect(createMovieFn).toHaveBeenCalled();
    });

    it('Debe evitar que se refresque la página luego de hacer submit con el uso del evento "preventDefault"', () => {
      const event = { preventDefault: () => {} };
      jest.spyOn(event, "preventDefault");
      createMovie.find("form").simulate("submit", event);
      expect(event.preventDefault).toBeCalled();
    });
  });
});
