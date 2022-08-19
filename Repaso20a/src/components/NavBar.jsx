import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <React.Fragment>
      <nav>
        <ul>
          <li>
            <NavLink to={"/home"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/users"}>Users</NavLink>
          </li>
          <li>
            <NavLink to={"/create"}>Create Users</NavLink>
          </li>
          <li>
            <NavLink to={"/about"}>About</NavLink>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
}

