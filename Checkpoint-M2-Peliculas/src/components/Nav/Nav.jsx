import "./nav.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";

//NO CAMBIEN EL CLASS COMPONENT A FUNCTIONAL COMPONENT PORQUE SINO LOS TEST NO VAN A CORRER!
export default class Nav extends Component {
  render() {
    return (
      <div className="nav">
        <Link to="/">Home</Link>
        <Link to="/movies/create">Create Movie</Link>
      </div>
    );
  }
}
