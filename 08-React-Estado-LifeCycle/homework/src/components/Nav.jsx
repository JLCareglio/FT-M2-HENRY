import React from "react";
import Logo from "../logoHenry.png";
import SearchBar from "./SearchBar.jsx";
import "./Nav.css";

function Nav({ onSearch }) {
  return (
    <div className="container">
      <div className="imagen">
        <img src={Logo} alt="logo" />
      </div>
      <span> HENRY 29C - Weather App</span>
      <SearchBar onSearch={onSearch} />
    </div>
  );
}

export default Nav;
