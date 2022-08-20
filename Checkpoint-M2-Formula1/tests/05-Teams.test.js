import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import TeamsConnected, {
  Teams,
  mapDispatchToProps,
  mapStateToProps,
} from "../src/components/Teams/Teams";
import { configure, mount, shallow } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import TeamsCard from "../src/components/TeamCard/TeamsCard";
import axios from "axios";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import mainImage from "../src/img-cp2/f1Logo.jpg";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

describe("<Teams />", () => {
  let teams, store, state, getAllTeamsSpy, componentDidMountSpy;
  global.fetch = nodeFetch;

  const mockStore = configureStore([thunk]);
  beforeEach(() => {
    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // "/teams" => Retorna la propiedad teams del archivo data.json
    apiMock.get("/teams").reply(200, data.teams);

    // "/teams/:id" => Retorna un team matcheado por su id
    let id = null;
    apiMock.get((uri)=>{
      id = Number(uri.split('/').pop()); // Number('undefined') => NaN
      return !!id
    })
    .reply(200, (uri, requestBody) => {
      return data.teams.find((team) => team.id === id) || {};
    });
    state = {
      teams: [],
      team: {},
    };
    store = mockStore(state);
    teams = mount(<TeamsConnected store={store} />);

    expect(isReact.classComponent(Teams)).toBeTruthy();

    //store.clearActions();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Debería rederizar un "h1" con el texto "Formula 1"', () => {
    expect(teams.find("h1").at(0).text()).toEqual("Formula 1");
  });

  it('Debería renderizar en un tag "img" la imagen provista en la carpeta "img-cp2"', () => {
    // Tendrías que importar la img a tu archivo "Teams.jsx" y luego usarla como source de img.
    // Chequeá como lo hacemos en este mismo archivo en la línea 19 ;)
    expect(teams.find("img").at(0).prop("src")).toEqual(mainImage);
  });

  it('La imagen debería tener un atributo "alt" con el texto "main-img"', () => {
    expect(teams.find("img").at(0).prop("alt")).toEqual("main-img");
  });

  it('Debería rederizar un "h3" con el texto "Teams"', () => {
    expect(teams.find("h3").at(0).text()).toEqual("Teams");
  });

  describe("connect Redux", () => {
    it("Debería traer de redux nuestras teams usando mapStateToProps", () => {
      // El estado debería tener un nombre "teams".
      expect(mapStateToProps(state)).toEqual({ teams: state.teams });
    });

    if (typeof mapDispatchToProps === "function") {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UNA FUNCIÓN.
      it("Debería traer por props la funcion getAllTeams de Redux usando mapDispatchToProps", () => {
        // Acá testeamos que hagas todo el proceso. Utilizas la funcion "mapDispatchToProps",
        // y con ella despachas la accion "getAllTeams".
        const getAllTeams = jest.spyOn(actions, "getAllTeams");
        const dispatch = jest.fn();
        const props = mapDispatchToProps(dispatch);
        props.getAllTeams();
        expect(dispatch).toHaveBeenCalled();
        expect(getAllTeams).toHaveBeenCalled();
      });
    } else {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UN OBJETO.
      it("Debería traer por props la action creator getAllTeams de Redux usando mapDispatchToProps", () => {
        // Acá testeamos que hagas todo el proceso. Utilizas connect y el objeto "mapDispatchToProps",
        // traes la acción getAllTeams. Con esto podrás usarla luego en el componente.
        const getAllTeams = jest.spyOn(actions, "getAllTeams");
        getAllTeams();
        expect(mapDispatchToProps.hasOwnProperty("getAllTeams")).toBeTruthy();
        expect(getAllTeams).toHaveBeenCalled();
      });
    }
  });

  describe("React LifeCycles", () => {
    getAllTeamsSpy = jest.fn();
    let instance;
    beforeEach(async () => {
      state = {
        teams: data.teams,
        team: {},
      };
      store = mockStore(state);
      teams = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/"]}>
            <TeamsConnected />
          </MemoryRouter>
        </Provider>
      );
    });

    beforeAll(() => {
      // Ojo acá. Antes que corran los demás tests, chequeamos que estés usando el lifeCycle correspondiente ( componentDidMount )
      // y que en él ejecutas la action creator "getAllTeams" para traerte toda esa data.
      // Si no pasan estos tests, no pasan los demás!
      componentDidMountSpy = jest.spyOn(Teams.prototype, "componentDidMount");
      instance = shallow(<Teams getAllTeams={getAllTeamsSpy} />).instance();

      instance.componentDidMount();
      expect(componentDidMountSpy).toHaveBeenCalled();
      expect(getAllTeamsSpy).toHaveBeenCalled();
    });

    it("Debería mapear la cantidad de teams que hayan en el store y renderizar una <TeamsCard /> por cada una", () => {
      // Cuidado acá. Como realizamos una petición al back (código asincrónico), el componente se va a
      // renderizar más rápido. Hay un problema con esto, se va a intentar renderizar algunos datos que

      // no existen todavía, lo que es igual a un fatal error. Deberías asegurarte que existen las
      // teams y luego renderizarlas!

      // Pista: Usa un renderizado condicional.

      // IMPORTANTE: revisar el código arriba de este test, el beforeAll.
      // Ahí se está testeando el uso del lifecycle componentDidMount y que en él
      // traigas la data a renderizar.
      expect(teams.find(TeamsCard)).toHaveLength(5);
    });

    it("Debería pasar como props a cada componente <TeamsCard /> las propiedades id, founder, name, base y image de cada team", () => {
      // PASARLE LA PROP keys en el mapeo.
      expect(teams.find(TeamsCard).at(0).props().id).toEqual(1);
      expect(teams.find(TeamsCard).at(0).props().founder).toEqual(
        "Enzo Ferrari"
      );
      expect(teams.find(TeamsCard).at(0).props().name).toEqual("Ferrari");
      expect(teams.find(TeamsCard).at(0).props().base).toEqual(
        "Maranello, Italy"
      );
      expect(teams.find(TeamsCard).at(0).props().image).toEqual(
        "https://img.remediosdigitales.com/96633b/140013_cor/450_1000.jpg"
      );

      expect(teams.find(TeamsCard).at(1).props().id).toEqual(2);
      expect(teams.find(TeamsCard).at(1).props().founder).toEqual(
        "Dietrich Mateschitz"
      );
      expect(teams.find(TeamsCard).at(1).props().name).toEqual(
        "Oracle Red Bull"
      );
      expect(teams.find(TeamsCard).at(1).props().base).toEqual(
        "Milton Keynes, United Kingdom"
      );
      expect(teams.find(TeamsCard).at(1).props().image).toEqual(
        "https://www.oracle.com/oce/press/assets/CONT627DB01268AB4125A078BA8CD375ADEF/native/og-social-redbull.gif"
      );

      expect(teams.find(TeamsCard).at(2).props().id).toEqual(3);
      expect(teams.find(TeamsCard).at(2).props().founder).toEqual(
        "Norbert Haug"
      );
      expect(teams.find(TeamsCard).at(2).props().name).toEqual("Mercedes");
      expect(teams.find(TeamsCard).at(2).props().base).toEqual(
        "Brackley, United Kingdom"
      );
      expect(teams.find(TeamsCard).at(2).props().image).toEqual(
        "https://bizbehindsports.com/wp-content/uploads/2020/08/1582638375557.jpg"
      );
    });
  });
});
