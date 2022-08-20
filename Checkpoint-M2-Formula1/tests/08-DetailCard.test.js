import * as data from "../db.json";

import { configure, shallow } from "enzyme";

import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import DetailCard from "../src/components/DetailCard/DetailCard";
import { Link } from "react-router-dom";
import React from "react";
import isReact from "is-react";

configure({ adapter: new Adapter() });

xdescribe("<DetailCard />", () => {
  let detailCard2;
  let detailCard;
  let [team1, team2, team3] = data.teams;

  // Si o si vas a tener que usar functional component! No van a correr ninguno de los tests si no lo haces!
  beforeEach(() => {
    detailCard2 = shallow(<DetailCard />);
    detailCard = (character) =>
      shallow(
        <DetailCard
          key={character.id}
          drivers={character.drivers}
          id={character.id}
          base={character.base}
          image={character.image}
          worldChampionships={character.worldChampionships}
        />
      );
    expect(isReact.classComponent(DetailCard)).toBeFalsy();
  });

  it('Debería renderizar un tag "img" y utilizar como source la imagen del equipo', () => {
    expect(detailCard(team1).find("img").at(0).prop("src")).toEqual(
      team1.image
    );
    expect(detailCard(team2).find("img").at(0).prop("src")).toEqual(
      team2.image
    );
    expect(detailCard(team3).find("img").at(0).prop("src")).toEqual(
      team3.image
    );
  });

  it('Debería renderizar un "p" que contenga el texto "ID: " más el id del equipo', () => {
    expect(detailCard(team1).find("p").at(0).text()).toBe(`ID: ${team1.id}`);
    expect(detailCard(team2).find("p").at(0).text()).toBe(`ID: ${team2.id}`);
    expect(detailCard(team3).find("p").at(0).text()).toBe(`ID: ${team3.id}`);
  });

  it('Debería renderizar un "p" que contenga el texto "Base: " más la base del equipo', () => {
    expect(detailCard(team1).find("p").at(1).text()).toBe(
      `Base: ${team1.base}`
    );
    expect(detailCard(team2).find("p").at(1).text()).toBe(
      `Base: ${team2.base}`
    );
    expect(detailCard(team3).find("p").at(1).text()).toBe(
      `Base: ${team3.base}`
    );
  });

  it('Debería renderizar un "p" que contenga el texto "Drivers: " más los pilotos del equipo', () => {
    expect(detailCard(team1).find("p").at(2).text()).toBe(
      `Drivers: ${team1.drivers}`
    );
    expect(detailCard(team2).find("p").at(2).text()).toBe(
      `Drivers: ${team2.drivers}`
    );
    expect(detailCard(team3).find("p").at(2).text()).toBe(
      `Drivers: ${team3.drivers}`
    );
  });

  it('Debería renderizar un "p" que contenga el texto "WorldChampionships: " más los campeonatos del equipo', () => {
    expect(detailCard(team1).find("p").at(3).text()).toBe(
      `WorldChampionships: ${team1.worldChampionships}`
    );
    expect(detailCard(team2).find("p").at(3).text()).toBe(
      `WorldChampionships: ${team2.worldChampionships}`
    );
    expect(detailCard(team3).find("p").at(3).text()).toBe(
      `WorldChampionships: ${team3.worldChampionships}`
    );
  });
  it('Debería renderizar un <Link to="" /> que vaya a "/" y a su vez envuelva un button con el texto Volver', () => {
    expect(detailCard2.find(Link).at(0).prop("to")).toEqual("/");
    expect(detailCard2.find("button")).toHaveLength(1);
    expect(detailCard2.find("button").text()).toEqual("Volver");
  });
});
