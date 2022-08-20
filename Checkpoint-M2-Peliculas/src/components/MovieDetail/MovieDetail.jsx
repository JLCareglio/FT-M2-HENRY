import React from "react";
import { useDispatch, useSelector } from "react-redux";
// Importar las actions como Object Modules, sino los test no funcionarán!
import * as actions from "../../redux/actions";

// Fijense en los test que SI O SI tiene que ser un functional component, de otra forma NO VAN A PASAR LOS TEST
// Deben usar Hooks para que los test pasen (lease tambien lo de react-redux).
// No realicen un destructuring de ellos, sino que utilicenlos de la siguiente forma 'React.useState' y 'React.useEffect' ,
// Si no lo hacen asi los test no van a correr.
// TIP: Aqui seria un buen momento para utilizar el hook useSelector.

const MovieDetail = (props) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actions.getMovieDetail(props.match.params.id));
  }, []);

  const { name, director, description, releaseYear } = useSelector(
    (state) => state.movieDetail
  );

  return (
    <div>
      <p>name: {name}</p>
      <p>director: {director}</p>
      <p>description: {description}</p>
      <p>releaseYear: {releaseYear}</p>
    </div>
  );
};

export default MovieDetail;
