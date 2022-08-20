import * as ReactRedux from "react-redux";
import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import DetailCard from "../src/components/DetailCard/DetailCard";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import TeamDetail from "../src/components/TeamDetail/TeamDetail";
import axios from "axios";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import nock from "nock";
import nodeFetch from "node-fetch";
import thunk from "redux-thunk";

axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

xdescribe("<TeamDetail />", () => {
  global.fetch = nodeFetch;
  let teamDetail, useSelectorStub, useSelectorFn, useEffect;
  const noTeam = {
    id: 6,
    name: "Aston Martin ",
    founder: "Lawrence Stroll",
    base: "Silverstone, Northamptonshire, UK",
  };

  const match = (id) => ({
    params: { teamId: id },
    isExact: true,
    path: "/teams/:teamId",
    url: `/teams/${id}`,
  });
  const mockStore = configureStore([thunk]);

  const store = (id) => {
    let state = {
      teams: data.teams.concat(noTeam),
      team: id !== 6 ? data.teams[id - 1] : data.teams.concat(noTeam),
    };
    return mockStore(state);
  };
  // Si o si vas a tener que usar functional component! No van a correr ninguno de los tests si no lo haces!
  // También fijate que vas a tener que usar algunos hooks. Tanto de React como de Redux!
  // Los hooks de React si o si los tenes que usar "React.useState", "React.useEffect". El test no los reconoce
  // cuando se hace destructuring de estos métodos === test no corren.
  beforeAll(() => expect(isReact.classComponent(TeamDetail)).toBeFalsy());
  const mockUseEffect = () => useEffect.mockImplementation((fn) => fn());
  beforeEach(() => {
    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // Se Mockea las request a las api
    apiMock.get("/teams").reply(200, data.teams);

    // "/teams/:id" => Retorna un producto matcheado por su id
    let id = null;
    apiMock.get((uri)=>{
      id = Number(uri.split('/').pop()); // Number('undefined') => NaN
      return !!id
    })
    .reply(200, (uri, requestBody) => {
      return data.teams.find((team) => team.id === id) || {};
    });
    useSelectorStub = jest.spyOn(ReactRedux, "useSelector");
    useSelectorFn = (id) =>
      useSelectorStub.mockReturnValue(store(id).getState().team);
    useEffect = jest.spyOn(React, "useEffect");
    teamDetail = (id) =>
      mount(
        <ReactRedux.Provider store={store(id)}>
          <MemoryRouter initialEntries={[`/teams/${id}`]}>
            <TeamDetail match={match(id)} />
          </MemoryRouter>
        </ReactRedux.Provider>
      );
    mockUseEffect();
    mockUseEffect();
  });

  afterEach(() => jest.restoreAllMocks());

  it("Debería usar un useEffect y dentro de este, dispachar la acción getTeam, pasandole como argumento el ID del team a renderizar", () => {
    // Nuevamente testeamos todo el proceso. Tenes que usar un useEffect, y despachar la acción "getTeam".
    const useDispatch = jest.spyOn(ReactRedux, "useDispatch");
    const getTeam = jest.spyOn(actions, "getTeam");
    teamDetail(1);
    expect(useEffect).toHaveBeenCalled();
    expect(useDispatch).toHaveBeenCalled();
    expect(getTeam).toHaveBeenCalled();
  });

  it('Debería recibir por props el objeto "match". Utilizar el "teamId" de "params" para despachar la action "getTeam" y renderizar un tag "h1" que diga "Team Detail", tambien renderizar dos tag "p" en el cual el primer "p" muestre el name del team y el otro muestre el founder del team', () => {
    const team = data.teams[0];
    // Fijate que para traerte los datos desde Redux, vas a tener que usar el hook de Redux "useSelector"
    // para que los tests pasen!
    // Lo que se esta testeando aca, es que el componente renderice los detalles del todo correctamente,
    // no la estructura del componente asi que eres libre de diseñar la estructura, siempre y cuando se muestren los datos del todo.
    // Verificar la llegada de datos en el objeto "match.params", si le pasamos mal el id puede romper todo el test en el caso que no exista nada.
    useSelectorFn(1);
    expect(teamDetail(1).find("h1").at(0).text()).toBe("Team Detail");
    expect(teamDetail(1).find("p").at(0).text()).toBe(team.name);
    expect(teamDetail(1).find("p").at(1).text()).toBe(team.founder);
    expect(useSelectorStub).toHaveBeenCalled();
    expect(useEffect).toHaveBeenCalled();
  });

  it("Debería renderizar una <DetailCard /> por cada equipo", () => {
    // PASARLE LA PROP keys en el mapeo.
    useSelectorFn(1);
    expect(teamDetail(1).find(DetailCard)).toHaveLength(1);
    useSelectorFn(2);
    expect(teamDetail(2).find(DetailCard)).toHaveLength(1);
    useSelectorFn(3);
    expect(teamDetail(3).find(DetailCard)).toHaveLength(1);
    expect(useSelectorStub).toHaveBeenCalled();
    expect(useEffect).toHaveBeenCalled();
  });

  it("Debería pasar a cada <DetailCard /> como props todos los datos del equipo: id, drivers, base, image y worldChampionships", () => {
    useSelectorFn(1);
    expect(teamDetail(1).find(DetailCard).at(0).props().id).toBe(1);
    expect(teamDetail(1).find(DetailCard).at(0).props().drivers).toBe(
      "Charles Leclerc, Carlos Sainz"
    );
    expect(teamDetail(1).find(DetailCard).at(0).props().base).toBe(
      "Maranello, Italy"
    );
    expect(teamDetail(1).find(DetailCard).at(0).props().image).toBe(
      "https://img.remediosdigitales.com/96633b/140013_cor/450_1000.jpg"
    );
    expect(
      teamDetail(1).find(DetailCard).at(0).props().worldChampionships
    ).toBe(16);

    useSelectorFn(2);
    expect(teamDetail(2).find(DetailCard).at(0).props().id).toBe(2);
    expect(teamDetail(2).find(DetailCard).at(0).props().drivers).toBe(
      "Max Verstappen, Sergio Perez"
    );
    expect(teamDetail(2).find(DetailCard).at(0).props().base).toBe(
      "Milton Keynes, United Kingdom"
    );
    expect(teamDetail(2).find(DetailCard).at(0).props().image).toBe(
      "https://www.oracle.com/oce/press/assets/CONT627DB01268AB4125A078BA8CD375ADEF/native/og-social-redbull.gif"
    );
    expect(
      teamDetail(2).find(DetailCard).at(0).props().worldChampionships
    ).toBe(4);
    expect(useSelectorStub).toHaveBeenCalled();
    expect(useEffect).toHaveBeenCalled();
  });
});
