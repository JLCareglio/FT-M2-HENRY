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

  it('Debería renderizar dos <Link to="" />. El primero que vaya a "/" y el segundo a "/movies/create"', () => {
    // Podes importar el componente Link de react-router-dom.
    expect(nav.find(Link).length).toBeGreaterThanOrEqual(2);
    expect(nav.find(Link).find({to:"/"}).length).toBe(1)
    expect(nav.find(Link).find({to:"/movies/create"}).length).toBe(1)
  });

  it('Debería tener un Link con el texto "Home" que cambie la ruta hacia "/"', () => {
    expect(nav.find(Link).find({to:"/"}).text()).toBe("Home");
  });

  it('Debería tener un segundo Link, con texto "Create Movie" y que cambie la ruta hacia "/movies/create"', () => {
    expect(nav.find(Link).find({to:"/movies/create"}).text()).toBe("Create Movie");
  });
});
