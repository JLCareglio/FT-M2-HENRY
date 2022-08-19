import React from "react";
import { useDispatch } from "react-redux";
// import { connect } from "react-redux";
// Importar las actions como Object Modules, sino los test no funcionarán!
import * as actions from "../../redux/actions";

// Fijense en los test que SI O SI tiene que ser un functional component, de otra forma NO VAN A PASAR LOS TEST
// Deben usar Hooks para que los test pasen.
// No realicen un destructuring de ellos, sino que utilicenlos de la siguiente forma 'React.useState' y 'React.useEffect' ,
// Si no lo hacen asi los test no van a correr.

const CreateMovie = () => {
  let [formValues, setFormValues] = React.useState({
    name: "",
    releaseYear: 0,
    description: "",
    director: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(actions.createMovie(formValues));
    setFormValues({ name: "", releaseYear: "", description: "", director: "" });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label>Name: </label>
      <input
        type="text"
        name="name"
        value={formValues.name}
        onChange={(e) => handleChange(e)}
      />
      <label>ReleaseYear: </label>
      <input
        type="number"
        name="releaseYear"
        value={formValues.releaseYear}
        onChange={(e) => handleChange(e)}
      />
      <label>Description: </label>
      <textarea
        name="description"
        value={formValues.description}
        onChange={(e) => handleChange(e)}
      ></textarea>
      <label>Director: </label>
      <input
        type="text"
        name="director"
        value={formValues.director}
        onChange={(e) => handleChange(e)}
      />
      <button type="submit">Create Movie</button>
    </form>
  );
};

export default CreateMovie;
