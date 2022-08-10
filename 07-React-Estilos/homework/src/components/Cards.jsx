import React from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 7px;
`;

export default function Cards({ cities }) {
  // acá va tu código
  // tip, podés usar un map
  return (
    <Container>
      {cities && cities.length > 0 ? (
        cities.map((ciudad) => {
          return (
            <Card
              key={ciudad.id}
              max={ciudad.main.temp_max}
              min={ciudad.main.temp_min}
              name={ciudad.name}
              img={ciudad.weather[0].icon}
              onClose={() => alert(ciudad.name)}
            />
          );
        })
      ) : (
        <h1>No hay ciudades para mostrar</h1>
      )}
    </Container>
  );
}
