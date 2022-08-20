import * as data from "../db.json";

import {
  GET_ALL_TEAMS,
  GET_TEAM,
  createTeam,
  deleteTeam,
} from "../src/redux/actions";

import rootReducer from "../src/redux/reducer";

describe("Reducer", () => {
  const state = {
    teams: [],
    team: {},
  };

  it("Debería retornar el estado inicial si no se pasa un type válido", () => {
    expect(rootReducer(undefined, [])).toEqual({ teams: [], team: {} });
  });

  it('Debería guardar en nuestro state los teams obtenidos de nuestro llamado al back cuando action type es "GET_ALL_TEAMS"', () => {
    const result = rootReducer(state, {
      type: GET_ALL_TEAMS,
      payload: data.teams,
    });
    // Ojooo. Recodar que no debemos mutar nuestro state!
    expect(result).not.toEqual(state);
    expect(result).toEqual({
      teams: data.teams, // Cuando ejecutes los tests, vas a ver bien lo que espera que le llegue!
      team: {},
    });
  });

  it('Debería guardar en nuestro state el team obtenido de nuestro llamado al back cuando action type es "GET_TEAM"', () => {
    const result = rootReducer(state, {
      type: GET_TEAM,
      payload: data.teams[0],
    });
    // Ojooo. Recodar que no debemos mutar nuestro state!
    expect(result).not.toEqual(state);
    expect(result).toEqual({
      teams: [],
      team: data.teams[0],
    });
  });

  it('Debería crear un nuevo team y guardarlo en nuestro reducer cuando action type es "CREATE_TEAM"', () => {
    const state = {
      teams: data.teams,
      team: {},
    };

    const payload1 = {
      name: "Aston Martin",
      founder: "Lawrence Stroll",
      base: "Silverstone, Northamptonshire, UK",
    };

    const payload2 = {
      name: "Williams Racing",
      founder: "Frank Williams",
      base: "Grove, Oxfordshire, UK",
    };

    const teams1 = [
      ...data.teams,
      {
        id: 6,
        name: "Aston Martin",
        founder: "Lawrence Stroll",
        base: "Silverstone, Northamptonshire, UK",
      },
    ];
    const teams2 = [
      ...teams1,
      {
        id: 7,
        name: "Williams Racing",
        founder: "Frank Williams",
        base: "Grove, Oxfordshire, UK",
      },
    ];
    const result1 = rootReducer(state, createTeam(payload1));
    const result2 = rootReducer(
      { ...state, teams: teams1 },
      createTeam(payload2)
    );

    // Ojooo. Recodar que no debemos mutar nuestro state!
    expect(result1).not.toEqual(state);
    expect(result2).not.toEqual(state);

    expect(result1).toEqual({ team: {}, teams: teams1 });
    expect(result2).toEqual({ team: {}, teams: teams2 });
  });

  it('Debería eliminar un team de nuestro store cuando action type es "DELETE_TEAM"', () => {
    const state = {
      teams: data.teams,
      team: {},
    };

    const teams1 = [data.teams[1], data.teams[2], data.teams[3], data.teams[4]];
    const teams2 = [data.teams[0], data.teams[1], data.teams[3], data.teams[4]];
    const result1 = rootReducer(state, deleteTeam(1));
    const result2 = rootReducer(state, deleteTeam(3));

    // Ojooo. Recodar que no debemos mutar nuestro state!
    expect(result1).not.toEqual(state);
    expect(result2).not.toEqual(state);

    expect(result1).toEqual({ team: {}, teams: teams1 });
    expect(result2).toEqual({ team: {}, teams: teams2 });
  });
});
