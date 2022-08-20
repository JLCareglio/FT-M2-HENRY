import "./home.css";
import mainImg from "../../img-cp2/main-image-cp2.jpg";
import React, { Component } from "react";
import MovieCard from "../MovieCard/MovieCard";

import { connect } from "react-redux";
// Importar las actions como Object Modules, sino los test no funcionarán!
import * as actions from "../../redux/actions";
// Fijense en los test que SI O SI tiene que ser un class component, de otra forma NO VAN A PASAR LOS TEST.

export class Home extends Component {
  componentDidMount() {
    this.props.getAllMovies();
  }
  render() {
    return (
      <div className="home">
        <h1>Henry Movies</h1>
        <img src={mainImg} alt="henry-movies-logo" />
        <h3>Movies</h3>
        <h4>Checkpoint M2</h4>
        {this.props.movies &&
          this.props.movies.map((props) => {
            return (
              <MovieCard
                key={props.id}
                id={props.id}
                name={props.name}
                director={props.director}
                releaseYear={props.releaseYear}
                image={props.image}
              />
            );
          })}
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  return { movies: state.movies };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    getAllMovies: () => dispatch(actions.getAllMovies()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
