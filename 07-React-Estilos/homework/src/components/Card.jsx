import React from "react";
import styled from "styled-components";

const Container = styled.div`
  color: #c8b6e2;
  display: inline-block;
  background-color: #7a86b6;
  border-radius: 12px;
  width: 250px;
  height: 250px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Button = styled.button`
  background-color: #C74B50;
  border-radius: 6px;
  width: 15px;
  height: 15px;
  text-align: center;
  position: relative;
  float: right;
  border: none;
  margin: 5px 5px 0 0;
`;

export default function Card({ max, min, name, img, onClose }) {
  // acá va tu código
  return (
    <Container>
      <Button onClick={onClose}></Button>
      <h2>{name}</h2>
      <Info>
        <h3>Min: {min}</h3>
        <h3>Max: {max}</h3>
      </Info>
      <img
        src={`http://openweathermap.org/img/wn/${img}@2x.png`}
        alt="imagen de clima"
      />
    </Container>
  );
}
