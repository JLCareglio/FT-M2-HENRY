import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link } from 'react-router-dom';
import { removeMovieFavorite } from "../../actions";
import "./Favorites.css";

export class ConnectedList extends Component {
  render() {
    return (
      <div>
        <h2>Películas Favoritas</h2>
        <ul>
          {this.props.favorites?.map((pelicula) => {
            return (
              <li key={pelicula.imdbID}>
                <span>{pelicula.Title}</span>
                <button
                  onClick={() =>
                    this.props.removeMovieFavorite(pelicula.imdbID)
                  }
                >
                  🔥
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    favorites: state.moviesFavorites,
  };
}

export default connect(mapStateToProps, { removeMovieFavorite })(ConnectedList);
