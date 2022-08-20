import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import { Link, MemoryRouter } from "react-router-dom";
import TeamsCardConnected, {
  TeamsCard,
  mapDispatchToProps,
} from "../src/components/TeamCard/TeamsCard";
import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import thunk from "redux-thunk";

configure({ adapter: new Adapter() });

describe("<TeamsCard />", () => {
  let team1 = data.teams[0];
  let team2 = data.teams[1];
  let team3 = data.teams[2];
  const { DELETE_TEAM } = actions;
  let teamCard, state, store, teams;
  const mockStore = configureStore([thunk]);
  teams = data.teams;
  state = {
    teams: [],
    team: {},
  };
  store = mockStore(state);
  // Si o si vas a tener que usar class component! No van a correr ninguno de los tests si no lo haces.
  beforeEach(() => {
    teamCard = (team) =>
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <TeamsCardConnected
              id={team.id}
              founder={team.founder}
              name={team.name}
              base={team.base}
              image={team.image}
            />
          </MemoryRouter>
        </Provider>
      );
    expect(isReact.classComponent(TeamsCard)).toBeTruthy();
  });

  afterEach(() => jest.restoreAllMocks());

  describe("Estructura", () => {
    it('Debería renderizar un "button"', () => {
      expect(teamCard(teams[0]).find("button")).toHaveLength(1);
    });

    it('Debería renderizar un tag "h3" que muestre lo que contiene el "name" de cada "Team"', () => {
      expect(teamCard(teams[0]).find("h3").at(0).text()).toBe("Ferrari");
      expect(teamCard(teams[1]).find("h3").at(0).text()).toBe(
        "Oracle Red Bull"
      );
      expect(teamCard(teams[2]).find("h3").at(0).text()).toBe("Mercedes");
    });

    it('Debería renderizar un tag "img" y utilizar como source la imagen de cada Team', () => {
      expect(teamCard(team1).find("img").at(0).prop("src")).toEqual(
        team1.image
      );
      expect(teamCard(team2).find("img").at(0).prop("src")).toEqual(
        team2.image
      );
      expect(teamCard(team3).find("img").at(0).prop("src")).toEqual(
        team3.image
      );
    });

    it('Debería renderizar un "p" que contenga el texto "Founder: " más el fundador de cada "Team"', () => {
      expect(teamCard(teams[0]).find("p").at(0).text()).toBe(
        "Founder: Enzo Ferrari"
      );
      expect(teamCard(teams[1]).find("p").at(0).text()).toBe(
        "Founder: Dietrich Mateschitz"
      );
      expect(teamCard(teams[2]).find("p").at(0).text()).toBe(
        "Founder: Norbert Haug"
      );
    });

    it('Debería renderizar un "p" que contenga el texto "Base: " más la prop base de cada "Team"', () => {
      expect(teamCard(teams[0]).find("p").at(1).text()).toBe(
        "Base: Maranello, Italy"
      );
      expect(teamCard(teams[1]).find("p").at(1).text()).toBe(
        "Base: Milton Keynes, United Kingdom"
      );
      expect(teamCard(teams[2]).find("p").at(1).text()).toBe(
        "Base: Brackley, United Kingdom"
      );
    });

    it('Debería renderizar un componente <Link> que encierre el "name" de cada "Team" y debería redirigir a "/teams/:teamId"', () => {
      // El valor de "teamId" lo tenes que sacar del objeto team, tiene una propiedad "id".
      expect(teamCard(teams[0]).find(Link)).toHaveLength(1);
      expect(teamCard(teams[0]).find(Link).at(0).prop("to")).toEqual(
        "/teams/1"
      );
    });
  });

  describe("connect redux", () => {
    if (typeof mapDispatchToProps === "function") {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UNA FUNCIÓN.
      it("Debería traer por props la funcion deleteTeam de Redux usando mapDispatchToProps", () => {
        // Usamos "mapDispatchToProps", pasamos a props la funcion deleteTeam.
        // Se debe llamar exactamente igual!
        const deleteTeamSpy = jest.spyOn(actions, "deleteTeam");
        expect(mapDispatchToProps.hasOwnProperty("deleteTeam")).toBeTruthy();
        mapDispatchToProps.deleteTeam = deleteTeamSpy;
        mapDispatchToProps.deleteTeam(1);
        expect(deleteTeamSpy).toHaveBeenCalled();
      });
    } else {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UN OBJETO.
      it("Debería traer por props la action creator deleteTeam de Redux usando mapDispatchToProps", () => {
        // Acá testeamos que hagas todo el proceso. Utilizas connect y el objeto "mapDispatchToProps",
        // traes la acción 'deleteTeam' y la despachas.
        const deleteTeamSpy = jest.spyOn(actions, "deleteTeam");
        deleteTeamSpy(1);
        expect(mapDispatchToProps.hasOwnProperty("deleteTeam")).toBeTruthy();
        expect(deleteTeamSpy).toHaveBeenCalled();
      });
    }
  });

  describe("Dispatch to store", () => {
    it('Debería hacer un dispatch al store utilizando la action "deleteTeam" al hacer click en el boton previamente creado. Debe pasarle el Id del team', () => {
      expect(mapDispatchToProps.hasOwnProperty("deleteTeam")).toBeTruthy();
      mapDispatchToProps.deleteTeam = actions.deleteTeam;
      teamCard(teams[0]).find("button").simulate("click");
      expect(store.getActions()).toEqual([{ type: DELETE_TEAM, payload: 1 }]);
    });
  });
});
