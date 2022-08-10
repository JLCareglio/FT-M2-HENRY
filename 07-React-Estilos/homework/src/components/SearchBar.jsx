import React from "react";
import styled from "styled-components";

const Container = styled.div``;
const Input = styled.input`
  color: #c8b6e2;
  background-color: #7a86b6;
  margin: 0 10px;
  border-radius: 6px;
  border: none;
  height: 34px;
  text-align: center;
`;
const Button = styled.button`
  background-color: #a8a4ce;
  border-radius: 6px;
  width: 34px;
  height: 34px;
  border: none;
`;

export default function SearchBar(props) {
  // acá va tu código
  return (
    <Container>
      <Input type="text" id="input" />
      <Button onClick={() => props.onSearch("")}>🔎</Button>
    </Container>
  );
}
