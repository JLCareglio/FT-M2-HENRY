import "./movieCard.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import React from "react";
// Importar las actions como Object Modules, sino los test no funcionarán!
import * as actions from "../../redux/actions";
//PARA QUE LOS TEST CORRAN, DEBEN HACER ESTE COMPONENTE COMO UN FUNCIONAL COMPONENT.

const MovieCard = ({ id, name, director, releaseYear, image }) => {
  const dispatch = useDispatch();
  return (
    <div className="card">
      <button onClick={() => dispatch(actions.deleteMovie(id))}>x</button>
      <h3>{name}</h3>
      <img src={image} alt={name} />
      <p>ReleaseYear: {releaseYear}</p>
      <p>Director: {director}</p>
      <Link to={`/movie/${id}`}>{name}</Link>
    </div>
  );
};

export default MovieCard;
