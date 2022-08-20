import * as data from "../db.json";

import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeam,
} from "../src/redux/actions";

import axios from "axios";
import configureStore from "redux-mock-store";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

axios.defaults.adapter = require("axios/lib/adapters/http");

describe("Actions", () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({ teams: [] });
  global.fetch = nodeFetch;
  beforeEach(() => {
    store.clearActions();
    const apiMock = nock("http://localhost:3001").persist();

    // Se Mockea las request a las api
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
  });

  describe("getAllTeams", () => {
    it('Debería hacer un dispatch con las propiedades type "GET_ALL_TEAMS" y como payload, el resultado del fetch al link provisto', async () => {
      return store
        .dispatch(getAllTeams())
        .then(() => {
          const actions = store.getActions();
          // eslint-disable-next-line jest/no-conditional-expect
          expect(actions[0].payload.length).toBe(5);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(actions[0]).toEqual({
            type: "GET_ALL_TEAMS",
            payload: data.teams,
          });
        })
        .catch((err) => {
          // Acá llegamos cuando tu petición al backend no salió como el test lo pide. Revisá el error en la consola y verificá
          // qué es lo que está pasando.
          console.error(err);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(err).toBeUndefined();
        });
    });
  });

  describe("getTeam", () => {
    it('Debería hacer un dispatch con las propiedades type "GET_TEAM" y como payload, el resultado del fetch al link provisto', async () => {
      const payload = data.teams[0];
      return store
        .dispatch(getTeam(1))
        .then(() => {
          const actions = store.getActions();
          // eslint-disable-next-line jest/no-conditional-expect
          expect(actions[0]).toStrictEqual({
            type: "GET_TEAM",
            payload: { ...payload },
          });
        })
        .catch((err) => {
          // Acá llegamos cuando tu petición al backend no salió como el test lo pide. Revisá el error en la consola y verificá
          // qué es lo que está pasando.
          console.error(err);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(err).toBeUndefined();
        });
    });
  });

  describe("createTeam", () => {
    it('Debería retornar una action con las propiedades type "CREATE_TEAM" y payload: contiene los values recibidos como argumento y un ID incremental en la action creator "createTeam"', () => {
      // Utilizar la variable id creada en el archivo index.js. La inicializamos en 3 para que los íd's no choquen con los existentes.
      const payload1 = {
        name: "Williams",
        base: "Grove, Oxfordshire, UK",
        founder: "Frank Williams",
      };
      const payload2 = {
        name: "Aston Martin",
        base: "Silverstone, Northamptonshire, UK",
        founder: "Lawrence Stroll",
      };

      expect(createTeam(payload1)).toEqual({
        type: "CREATE_TEAM",
        payload: {
          id: 6,
          name: "Williams",
          base: "Grove, Oxfordshire, UK",
          founder: "Frank Williams",
        },
      });

      expect(createTeam(payload2)).toEqual({
        type: "CREATE_TEAM",
        payload: {
          id: 7,
          name: "Aston Martin",
          base: "Silverstone, Northamptonshire, UK",
          founder: "Lawrence Stroll",
        },
      });
    });
  });

  describe("deleteTeam", () => {
    it('Debería retornar una action con las propiedades type "DELETE_TEAM" y como payload el id del team a eliminar. Recibe el id por argumento', () => {
      expect(deleteTeam(1)).toEqual({ type: "DELETE_TEAM", payload: 1 });
      expect(deleteTeam(2)).toEqual({ type: "DELETE_TEAM", payload: 2 });
    });
  });
});
