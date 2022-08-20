import * as data from "../db.json";

import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import App from "../src/App";
import CreateTeam from "../src/components/CreateTeam/CreateTeam";
import { MemoryRouter } from "react-router-dom";
import Nav from "../src/components/Nav/Nav";
import { Provider } from "react-redux";
import React from "react";
import TeamDetail from "../src/components/TeamDetail/TeamDetail";
import Teams from "../src/components/Teams/Teams";
import axios from "axios";
import configureStore from "redux-mock-store";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

describe("<App />", () => {
  global.fetch = nodeFetch;

  let store;
  const routes = ["/", "/otraRuta", "/teams", "/teams/1", "/team/create"];
  const mockStore = configureStore([thunk]);
  const state = {
    teams: data.teams,
    team: data.teams[0],
  };

  beforeEach(async () => {
    // Mockeo de la request a la api
    const apiMock = nock("http://localhost:3001").persist();

    apiMock.get("/teams").reply(200, data.teams);

    let id = null;
    apiMock.get((uri)=>{
      id = Number(uri.split('/').pop()); // Number('undefined') => NaN
      return !!id
    })
    .reply(200, (uri, requestBody) => {
      return data.teams.find((team) => team.id === id) || {};
    });

    store = mockStore(state);
  });

  const componentToUse = (route) => {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  };

  describe("El componente Nav debe ser renderizado en todas las rutas", () => {
    it('Debería ser renderizado en la ruta "/"', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(Nav)).toHaveLength(1);
    });

    it('Debería ser renderizado en la ruta "/otraRuta"', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Nav)).toHaveLength(1);
    });
  });

  it('El componente "Teams" se debería renderizar solamente en la ruta "/"', () => {
    const app = mount(componentToUse(routes[0]));
    expect(app.find(Teams)).toHaveLength(1);
    expect(app.find(Nav)).toHaveLength(1);
  });

  it('El componente "TeamDetail" se debería renderizar solamente en la ruta "/teams/:teamId"', () => {
    const app = mount(componentToUse(routes[3]));
    expect(app.find(TeamDetail)).toHaveLength(1);
    expect(app.find(Teams)).toHaveLength(0);
    expect(app.find(Nav)).toHaveLength(1);
  });

  it('El componente "CreateTeam" se debería renderizar solamente en la ruta "/team/create"', () => {
    const app = mount(componentToUse(routes[4]));
    expect(app.find(CreateTeam)).toHaveLength(1);
    expect(app.find(Teams)).toHaveLength(0);
    expect(app.find(Nav)).toHaveLength(1);
  });
});
