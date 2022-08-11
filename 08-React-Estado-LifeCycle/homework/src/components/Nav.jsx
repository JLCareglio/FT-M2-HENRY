import React from "react";
import Logo from "../logoHenry.png";
import SearchBar from "./SearchBar.jsx";
import styled from "styled-components";

const NavBar = styled.nav`
  background-color: gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function Nav({ onSearch }) {
  return (
    <NavBar>
      <img src={Logo} alt="logo de Henry" />
      <h1>PepeWeather</h1>
      <SearchBar onSearch={onSearch}/>
    </NavBar>
  );
}

export default Nav;
