import { configure, shallow } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { Link } from "react-router-dom";
import Nav from "../src/components/Nav/Nav";
import React from "react";
import isReact from "is-react";

configure({ adapter: new Adapter() });

describe("<Nav />", () => {
  let nav;
  // Si o si vas a tener que usar class component! No van a correr ninguno de los tests si no lo haces. <3
  beforeEach(() => {
    nav = shallow(<Nav />);
    expect(isReact.classComponent(Nav)).toBeTruthy();
  });

  it('Debería renderizar dos <Link to="" />. El primero que vaya a "/", y el segundo a "/team/create"', () => {
    // Podes importar el componente Link de react-router-dom.
    expect(nav.find(Link).length).toBeGreaterThanOrEqual(2);
    expect(nav.find(Link).length).toBeGreaterThanOrEqual(2);
    expect(nav.find(Link).at(0).prop("to")).toEqual("/");
    expect(nav.find(Link).at(1).prop("to")).toEqual("/team/create");
  });

  it('Debería tener un Link con el texto "Teams" que cambie la ruta hacia "/"', () => {
    // El orden en el que se declaran los Links es importante!
    expect(nav.find(Link).at(0).prop("to")).toEqual("/");
    expect(nav.find(Link).at(0).text()).toEqual("Teams");
  });

  it('Debería tener un segundo Link, con texto "Create Team" y que cambie la ruta hacia "/team/create"', () => {
    expect(nav.find(Link).at(1).prop("to")).toEqual("/team/create");
    expect(nav.find(Link).at(1).text()).toEqual("Create Team");
  });
});
