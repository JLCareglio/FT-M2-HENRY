import * as actions from "../src/redux/actions";
import * as data from "../db.json";

import { configure, mount } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import CreateTeam from "../src/components/CreateTeam/CreateTeam";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import isReact from "is-react";
import thunk from "redux-thunk";

configure({ adapter: new Adapter() });

xdescribe("<CreateTeam />", () => {
  const state = { teams: data.teams };
  const mockStore = configureStore([thunk]);
  const { CREATE_TEAM } = actions;

  beforeAll(() => expect(isReact.classComponent(CreateTeam)).toBeFalsy());

  // Si o si vas a tener que usar functional component! No van a correr ninguno de los tests si no lo haces!
  // También fijate que vas a tener que usar algunos hooks. Tanto de React como de Redux!
  // Los hooks de React si o si los tenes que usar "React.useState", "React.useEffect". El test no los reconoce
  // cuando se hace destructuring de estos métodos === test no corren.
  xdescribe("Estructura", () => {
    let createTeam;
    let store = mockStore(state);
    beforeEach(() => {
      createTeam = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/team/create"]}>
            <CreateTeam />
          </MemoryRouter>
        </Provider>
      );
    });

    it("Debería renderizar un form", () => {
      expect(createTeam.find("form")).toHaveLength(1);
    });

    it('Debería renderizar un label con el texto "Name: "', () => {
      expect(createTeam.find("label").at(0).text()).toEqual("Name: ");
    });

    it('Debería renderizar un input con la propiedad "name" igual a "name"', () => {
      expect(createTeam.find('input[name="name"]')).toHaveLength(1);
    });

    it('Debería renderizar un label con el texto "Founder: "', () => {
      expect(createTeam.find("label").at(1).text()).toEqual("Founder: ");
    });

    it('Debería renderizar un input con la propiedad "name" igual a "founder"', () => {
      expect(createTeam.find('input[name="founder"]')).toHaveLength(1);
    });

    it('Debería renderizar un label con el texto "Base: "', () => {
      expect(createTeam.find("label").at(2).text()).toEqual("Base: ");
    });

    it('Debería renderizar un input con la propiedad "name" igual a "base"', () => {
      expect(createTeam.find('input[name="base"]')).toHaveLength(1);
    });

    it('Debería renderizar un button con "type" igual a "submit" y con texto "Create Team"', () => {
      expect(createTeam.find('button[type="submit"]')).toHaveLength(1);
      expect(createTeam.find("button").at(0).text()).toEqual("Create Team");
    });
  });

  xdescribe("Manejo de estados", () => {
    let useState, useStateSpy, createTeam;
    let store = mockStore(state);
    beforeEach(() => {
      useState = jest.fn();
      useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation((values) => [values, useState]);
      createTeam = mount(
        <Provider store={store}>
          <CreateTeam />
        </Provider>
      );
    });

    it("Debería setear correctamente los valores del estado inicial del componente", () => {
      expect(useStateSpy).toHaveBeenCalledWith({
        name: "",
        founder: "",
        base: "",
      });
    });

    xdescribe("Name input", () => {
      it('Debería cambiar de estado cuando cambie el valor del input "name', () => {
        createTeam.find('input[name="name"]').simulate("change", {
          target: { name: "name", value: "Aston Martin" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "Aston Martin",
          founder: "",
          base: "",
        });
      });
    });

    xdescribe("Founder input", () => {
      it('Debería cambiar de estado cuando cambie el valor del input "founder', () => {
        createTeam.find('input[name="founder"]').simulate("change", {
          target: { name: "founder", value: "Lawrence Stroll" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          founder: "Lawrence Stroll",
          base: "",
        });
      });
    });

    xdescribe("Base input", () => {
      it('Debería cambiar de estado cuando cambie el valor del input "base', () => {
        createTeam.find('input[name="base"]').simulate("change", {
          target: { name: "base", value: "Silverstone, Northamptonshire, UK" },
        });
        expect(useState).toHaveBeenCalledWith({
          name: "",
          founder: "",
          base: "Silverstone, Northamptonshire, UK",
        });
      });
    });
  });

  xdescribe("Dispatch to store", () => {
    let createTeam, useState, useStateSpy;
    let store = mockStore(state);

    beforeEach(() => {
      useState = jest.fn();
      useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementation((values) => [values, useState]);
      store = mockStore(state, actions.createTeamAction);
      store.clearActions();
      createTeam = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/team/create"]}>
            <CreateTeam />
          </MemoryRouter>
        </Provider>
      );
    });

    afterEach(() => jest.restoreAllMocks());

    it('Debería hacer un dispatch al store utilizando la action "createTeam" con los datos del state cuando se hace un "submit"', () => {
      // Acá deberías usar el hook de Redux "useDispatch" también!
      const createTeamFn = jest.spyOn(actions, "createTeam");
      createTeam
        .find('[type="submit"]')
        .simulate("submit", { preventDefault() {} });
      const expectedAction = [
        {
          payload: {
            name: "",
            founder: "",
            base: "",
            id: 6,
          },
          type: CREATE_TEAM,
        },
      ];
      expect(store.getActions()).toEqual(expectedAction);
      expect(CreateTeam.toString().includes("useDispatch")).toBeTruthy();
      expect(createTeamFn).toHaveBeenCalled();
    });

    it('Debería llamar al evento "preventDefault" para evitar que se refresque la página luego de hacer un submit', () => {
      const event = { preventDefault: () => {} };
      jest.spyOn(event, "preventDefault");
      createTeam.find("form").simulate("submit", event);
      expect(event.preventDefault).toBeCalled();
    });
  });
});
