import React from "react";
import Logo from "../img/logoHenry.png";
import SearchBar from "./SearchBar.jsx";
import "./Nav.css";
import { Link } from "react-router-dom";

function Nav({ onSearch }) {
  return (
    <div className="container">
      <Link to="/">
        <div className="imagen">
          <img src={Logo} alt="logo" />
        </div>
        <span> HENRY 29C - Weather App</span>
      </Link>

      <Link to="/about">
        <span>About</span>
      </Link>

      <SearchBar onSearch={onSearch} />
    </div>
  );
}

export default Nav;
