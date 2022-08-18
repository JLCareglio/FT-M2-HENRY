import React, { useState } from "react";
import "./App.css";
import Nav from "../components/Nav";
import Cards from "../components/Cards";
import About from "../components/About";
import Ciudad from "../components/Ciudad";
import axios from "axios";
import { Route, Switch } from "react-router-dom";

export default function App() {
  // espacio para codigo - React.useState()
  // estado para mantener un arreglo de ciudades
  const cristian = "2da6e283cd50bbbb9f1adb7897591d84";
  const apiKey = "4ae2636d8dfbdc3044bede63951a019b";
  const [ciudades, setCiudades] = useState([]);

  function onSearch(ciudad) {
    // fetch(
    //   `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`
    // )
    //   .then((r) => r.json())
    //   .then((recurso) => {
    //     console.log(recurso)
    //     if (recurso.main !== undefined) {
    //       const ciudad = {
    //         min: Math.round(recurso.main.temp_min),
    //         max: Math.round(recurso.main.temp_max),
    //         img: recurso.weather[0].icon,
    //         id: recurso.id,
    //         wind: recurso.wind.speed,
    //         temp: recurso.main.temp,
    //         name: recurso.name,
    //         weather: recurso.weather[0].main,
    //         clouds: recurso.clouds.all,
    //         latitud: recurso.coord.lat,
    //         longitud: recurso.coord.lon,
    //       };
    //       console.log(ciudades);
    //       setCiudades((oldCities) => [...oldCities, ciudad]);
    //     } else {
    //       alert("Ciudad no encontrada");
    //     }
    //   });

    // axios
    axios(
      `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${cristian}&units=metric`
    ).then((respuesta) => {
      if (respuesta.data.main !== undefined) {
        const ciudad = {
          min: Math.round(respuesta.data.main.temp_min),
          max: Math.round(respuesta.data.main.temp_max),
          img: respuesta.data.weather[0].icon,
          id: respuesta.data.id,
          wind: respuesta.data.wind.speed,
          temp: respuesta.data.main.temp,
          name: respuesta.data.name,
          weather: respuesta.data.weather[0].main,
          clouds: respuesta.data.clouds.all,
          latitud: respuesta.data.coord.lat,
          longitud: respuesta.data.coord.lon,
        };
        console.log(ciudades);
        setCiudades((oldCities) => [...oldCities, ciudad]);
      } else {
        alert("Ciudad no encontrada");
      }
    });
  }

  function onFilter(ciudadId) {
    let ciudad = ciudades.filter((c) => c.id === parseInt(ciudadId));
    if (ciudad.length > 0) {
      return ciudad[0];
    } else {
      return null;
    }
  }

  function onClose(id) {
    setCiudades((estadoAnterior) =>
      estadoAnterior.filter((el) => el.id !== id)
    );
  }

  return (
    <div className="App">
      <Route path="/">
        <Nav onSearch={onSearch} />
      </Route>
      <Route exact path="/about" component={About} />
      <Route
        exact
        path="/"
        render={() => <Cards cities={ciudades} onClose={onClose} />}
      />
      <Route exact path="/ciudad/:id">
        <Ciudad onFilter={onFilter} />
      </Route>
    </div>
  );
}
