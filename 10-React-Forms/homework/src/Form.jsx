import React, { useState } from "react";

// necesita export si es utilizado en otro lado (en este caso el test)
export function validate(estado) {
  // crea un obj de errores para retornarlo al final
  let errors = {};
  // validaciones para username
  if (!estado.username) {
    errors.username = "Username is required";
  } else if (!/\S+@\S+\.\S+/.test(estado.username)) {
    errors.username = "Username is invalid";
  }
  // validaciones para password
  if (!estado.password) {
    errors.password = "Password is required";
  } else if (!/(?=.*[0-9])/.test(estado.password)) {
    errors.password = "Password is invalid";
  }

  return errors;
}
// validate(algo) --> {} --> Puede tener (o no) props de errores

export default function Form() {
  // React.useState() --> sin destructuring en el import
  const [user, setUser] = useState({
    username: "",
    password: "",
    mail: "",
    otra: "",
  });

  const [errores, setErrores] = useState({});

  // console.log(user)
  const handleInputChange = function (ev) {
    // Modificar el estado: "como lo hago si es un obj?"
    // spread operator: ... --> "toma todo lo que haya dentro de"
    // setUser((estadoAnt) => {});
    setUser({ ...user, [ev.target.name]: ev.target.value });

    // aca iria la validacion
    // codigo:
    // let aux = validate(user) // --> devuelve obj
    setErrores(validate({ ...user, [ev.target.name]: ev.target.value }));
  };

  return (
    <form>
      <div>
        <h2>Log In</h2>
        <hr />
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className={errores.username && "danger"}
          />
          {errores.username && <p className="danger">{errores.username}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            className={errores.password && "danger"}
          />
          {errores.password && <p className="danger">{errores.password}</p>}
        </div>
        <div>
          <label>Mail:</label>
          <input
            type="text"
            name="mail"
            value={user.mail}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </form>
  );
}
