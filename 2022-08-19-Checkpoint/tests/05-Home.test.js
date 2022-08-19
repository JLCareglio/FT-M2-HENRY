import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import HomeConnected, {
  Home,
  mapDispatchToProps,
  mapStateToProps,
} from "../src/components/Home/Home";
import { configure, mount, shallow } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../src/components/MovieCard/MovieCard";
import { Provider } from "react-redux";
import React from "react";
import axios from "axios";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import mainImage from "../src/img-cp2/main-image-cp2.jpg";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

// Acá se mockea la action para que el test pueda funcionar correctamente, sin importar si hay un bug en ese archivo
jest.mock('../src/redux/actions/index.js', () => ({
  getAllMovies: () => ({
    type: 'GET_ALL_MOVIES'
  })
}))

jest.mock('../src/components/MovieCard/MovieCard', () => () => <></>);

describe("<Home />", () => {
  let home, store, state, getAllMoviesSpy, componentDidMountSpy;
  global.fetch = nodeFetch;
  const mockStore = configureStore([thunk]);
  beforeEach(() => {
    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // "/movies" => Retorna la propiedad movies del archivo data.json
    apiMock.get("/movies").reply(200, data.movies);

    // "/movies/:id" => Retorna una pelicula matcheado por su id
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
    state = {
      movies: [],
      movieDetail: {},
    };
    store = mockStore(state);
    home = mount(<HomeConnected store={store} />);
    // Si o si vas a tener que usar class component! No van a pasar ninguno de los tests si no lo haces.
    expect(isReact.classComponent(Home)).toBeTruthy();

    store.clearActions();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Debería rederizar un "h1" con el texto "Henry Movies"', () => {
    expect(home.find("h1").at(0).text()).toEqual("Henry Movies");
  });

  it('Debería renderizar en un tag "img" la imagen provista en la carpeta "img-cp2"', () => {
    // Tendrías que importar la img a tu archivo "Home.jsx" y luego usarla como source de img.
    // Podés ver como lo hacemos en este mismo archivo en la linea 16!
    expect(home.find("img").at(0).prop("src")).toEqual(mainImage);
  });

  it('La imagen debería tener un atributo "alt" con el texto "henry-movies-logo"', () => {
    expect(home.find("img").at(0).prop("alt")).toEqual("henry-movies-logo");
  });

  it('Debería rederizar un "h3" con el texto "Movies"', () => {
    expect(home.find("h3").at(0).text()).toEqual("Movies");
  });

  it('Debería rederizar un "h4" con el texto "Checkpoint M2"', () => {
    expect(home.find("h4").at(0).text()).toEqual("Checkpoint M2");
  });

  describe("connect Redux", () => {
    // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS TE DEJAMOS COMENTARIOS PARA CADA USO LEER BIEN!!🚨
    it("Debería traer de redux nuestros movies usando mapStateToProps", () => {
      // El estado debería tener un nombre "movies".
      expect(mapStateToProps(state)).toEqual({ movies: state.movies });
    });

    if (typeof mapDispatchToProps === "function") {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UNA FUNCIÓN.
      // IMPORTANTE! SI LO HACES DE ESTA FORMA LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA
      // import * as actions from "./../../redux/actions/index";
      it("Debería traer por props la funcion getAllMovies de Redux usando mapDispatchToProps", () => {
        // Acá testeamos que hagas todo el proceso. Utilizas la funcion "mapDispatchToProps",
        // y con ella despachas la accion "getAllMovies".
        const getAllMovies = jest.spyOn(actions, "getAllMovies");
        const dispatch = jest.fn();
        const props = mapDispatchToProps(dispatch);
        props.getAllMovies();
        expect(dispatch).toHaveBeenCalled();
        expect(getAllMovies).toHaveBeenCalled();
      });
    } else {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UN OBJETO.
      // IMPORTANTE! SI LO HACES DE ESTA FORMA mapDispatchToProps TIENE QUE SER EL OBJETO
      it("Debería traer por props la action creator getAllMovies de Redux usando mapDispatchToProps", () => {
        // Acá testeamos que hagas todo el proceso. Utilizas connect y el objeto "mapDispatchToProps",
        // traes la acción "getAllMovies". Con esto podrás usarla luego en el componente.
        const getAllMovies = jest.spyOn(actions, "getAllMovies");
        getAllMovies();
        expect(mapDispatchToProps.hasOwnProperty("getAllMovies")).toBeTruthy();
        expect(getAllMovies).toHaveBeenCalled();
      });
    }
  });

  describe("React LifeCycles", () => {
    getAllMoviesSpy = jest.fn();
    let instance;
    beforeEach(async () => {
      state = {
        movies: data.movies,
        movieDetails: {},
      };
      store = mockStore(state);
      home = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/home"]}>
            <HomeConnected />
          </MemoryRouter>
        </Provider>
      );
    });

    beforeAll(() => {
      // Ojo acá. Antes que corran los demás tests, chequeamos que estés usando el lifeCycle correspondiente ( componentDidMount )
      // y que en él ejecutas la action creator "getAllMovies" para traerte toda esa data.
      // Si no pasan estos tests, no pasan los demás!
      componentDidMountSpy = jest.spyOn(Home.prototype, "componentDidMount");
      instance = shallow(<Home getAllMovies={getAllMoviesSpy} />).instance();

      instance.componentDidMount();
      expect(componentDidMountSpy).toHaveBeenCalled();
      expect(getAllMoviesSpy).toHaveBeenCalled();
    });

    it("Debería mapear la cantidad de movies que hayan en el store y renderizar una <MovieCard /> por cada una", () => {
      // Cuidado acá. Como realizamos una petición al back (código asincrónico), el componente se va a
      // renderizar más rápido. Hay un problema con esto, se va a intentar renderizar algunos datos que
      // no existen todavía, lo que es igual a un fatal error. Deberías asegurarte que existen
      // movies y luego renderizarlas!
      // Pista: Usa un renderizado condicional.
      // IMPORTANTE: revisar el código arriba de este test, el beforeAll.
      // Ahí se está testeando el uso del lifecycle componentDidMount y que en él
      // traigas la data a renderizar.
      expect(home.find(MovieCard)).toHaveLength(5);
    });

    it("Debería pasar como props a cada componente <MovieCard /> las propiedades id, name, director , releaseYear, image, de cada movie", () => {
      // No olviden pasar la props KEY en el mapeo para mantener buenas practicas.
      expect(home.find(MovieCard).at(0).props().id).toEqual(1);
      expect(home.find(MovieCard).at(0).props().director).toEqual(
        "Martin Scorsese"
      );
      expect(home.find(MovieCard).at(0).props().name).toEqual("GoodFellas");
      expect(home.find(MovieCard).at(0).props().releaseYear).toEqual(1990);
      expect(home.find(MovieCard).at(0).props().image).toEqual(
        "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg"
      );

      expect(home.find(MovieCard).at(1).props().id).toEqual(2);
      expect(home.find(MovieCard).at(1).props().director).toEqual(
        "Richard Linklater"
      );
      expect(home.find(MovieCard).at(1).props().name).toEqual("Boyhood");
      expect(home.find(MovieCard).at(1).props().releaseYear).toEqual(2014);
      expect(home.find(MovieCard).at(1).props().image).toEqual(
        "https://upload.wikimedia.org/wikipedia/en/a/a6/Boyhood_%282014%29.png"
      );

      expect(home.find(MovieCard).at(2).props().id).toEqual(3);
      expect(home.find(MovieCard).at(2).props().director).toEqual(
        "Francis Ford Coppola"
      );
      expect(home.find(MovieCard).at(2).props().name).toEqual("Apocalypse Now");
      expect(home.find(MovieCard).at(2).props().releaseYear).toEqual(1980);
      expect(home.find(MovieCard).at(2).props().image).toEqual(
        "https://upload.wikimedia.org/wikipedia/en/c/c2/Apocalypse_Now_poster.jpg"
      );

      expect(home.find(MovieCard).at(3).props().id).toEqual(4);
      expect(home.find(MovieCard).at(3).props().director).toEqual(
        "Ron Shelton"
      );
      expect(home.find(MovieCard).at(3).props().name).toEqual(
        "White Men Can't Jump"
      );
      expect(home.find(MovieCard).at(3).props().releaseYear).toEqual(1992);
      expect(home.find(MovieCard).at(3).props().image).toEqual(
        "https://m.media-amazon.com/images/M/MV5BMTc5ZjE2MmEtYWIxYi00OGY0LTk0ZTUtMzJiYjI4OWZmNTVmXkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_.jpg"
      );
    });
  });
});
