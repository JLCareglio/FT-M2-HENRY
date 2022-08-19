import * as actions from "../src/redux/actions/index";
import * as data from "../db.json";

import { Link, MemoryRouter } from "react-router-dom";
import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import MovieCardConnected from "../src/components/MovieCard/MovieCard";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

configure({ adapter: new Adapter() });

jest.mock('../src/redux/actions/index', () => ({
  deleteMovie: () => ({
    type: 'DELETE_MOVIE'
  })
}))

describe("<MovieCard />", () => {
  let movieCard, state, store;
  const mockStore = configureStore([thunk]);
  let movies = data.movies;
  state = {
    movies: [],
    movieDetail: {},
  };
  store = mockStore(state);
  beforeEach(() => {
    movieCard = (movie) =>
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <MovieCardConnected
              id={movie.id}
              name={movie.name}
              director={movie.director}
              releaseYear={movie.releaseYear}
              image={movie.image}
            />
          </MemoryRouter>
        </Provider>
      );
  });

  afterEach(() => jest.restoreAllMocks());

  describe("Estructura", () => {
    it('Debería renderizar un "button" con el texto "x"', () => {
      const wrapper = movieCard(movies[0]);
      expect(wrapper.find("button").text()).toBe("x");
    });

    it('Debería renderizar un tag "h3" que muestre lo que contiene el "name" de cada "movie"', () => {
      expect(movieCard(movies[0]).find("h3").at(0).text()).toBe("GoodFellas");
      expect(movieCard(movies[1]).find("h3").at(0).text()).toBe("Boyhood");
      expect(movieCard(movies[2]).find("h3").at(0).text()).toBe(
        "Apocalypse Now"
      );
    });

    it("Debería renderizar la imágen de cada movie y un alt con el nombre del respectivo movie", () => {
      expect(movieCard(movies[0]).find("img").prop("src")).toBe(
        movies[0].image
      );
      expect(movieCard(movies[0]).find("img").prop("alt")).toBe(movies[0].name);
      expect(movieCard(movies[1]).find("img").prop("src")).toBe(
        movies[1].image
      );
      expect(movieCard(movies[1]).find("img").prop("alt")).toBe(movies[1].name);
    });

    it('Debería renderizar un tag "p" que contenga el texto "ReleaseYear: " más la prop "releaseYear" de cada "movie"', () => {
      expect(movieCard(movies[0]).find("p").at(0).text()).toBe(
        "ReleaseYear: 1990"
      );
      expect(movieCard(movies[1]).find("p").at(0).text()).toBe(
        "ReleaseYear: 2014"
      );
      expect(movieCard(movies[2]).find("p").at(0).text()).toBe(
        "ReleaseYear: 1980"
      );
      expect(movieCard(movies[3]).find("p").at(0).text()).toBe(
        "ReleaseYear: 1992"
      );
    });

    it('Debería renderizar un "p" que contenga el texto "Director: " más la prop "director" de cada "movie"', () => {
      expect(movieCard(movies[0]).find("p").at(1).text()).toBe(
        "Director: Martin Scorsese"
      );
      expect(movieCard(movies[1]).find("p").at(1).text()).toBe(
        "Director: Richard Linklater"
      );
      expect(movieCard(movies[2]).find("p").at(1).text()).toBe(
        "Director: Francis Ford Coppola"
      );
      expect(movieCard(movies[3]).find("p").at(1).text()).toBe(
        "Director: Ron Shelton"
      );
    });

    it('Debería renderizar un componente <Link> que encierre el "name" de cada "movie" y debería redirigir a "/movie/:id"', () => {
      // El valor de "id" lo tenes que sacar de las props, recuerda que les estas pasando una propiedad "id".
      expect(movieCard(movies[0]).find(Link)).toHaveLength(1);
      expect(movieCard(movies[0]).find(Link).at(0).prop("to")).toEqual(
        "/movie/1"
      );
    });
  });

  describe("Dispatch to store", () => {
    // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA🚨
    // import * as actions from "./../../redux/actions/index";

    it("Debería hacer un dispatch al store utilizando la action 'deleteMovie' al hacer click en el boton previamente creado para poder eliminar una movie. Debe pasarle el Id de la movie", () => {
      const deletemovieSpy = jest.spyOn(actions, "deleteMovie");
      const movieCard = mount(
        <Provider store={store}>
          <MemoryRouter>
            <MovieCardConnected
              id={movies[0].id}
              name={movies[0].name}
              director={movies[0].director}
              releaseYear={movies[0].releaseYear}
            />
          </MemoryRouter>
        </Provider>
      );
      movieCard.find("button").simulate("click");
      expect(deletemovieSpy).toHaveBeenCalled();
      expect(deletemovieSpy).toHaveBeenCalledWith(movies[0].id);

      const movieCard2 = mount(
        <Provider store={store}>
          <MemoryRouter>
            <MovieCardConnected
              id={movies[1].id}
              name={movies[1].name}
              director={movies[1].director}
              releaseYear={movies[1].releaseYear}
            />
          </MemoryRouter>
        </Provider>
      );
      movieCard2.find("button").simulate("click");
      expect(deletemovieSpy).toHaveBeenCalled();
      expect(deletemovieSpy).toHaveBeenCalledWith(movies[1].id);
    });
  });
});
