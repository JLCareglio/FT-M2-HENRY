import React, { useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Cards from "./components/Cards";
import axios from "axios";

export default function App() {
  // espacio para codigo - React.useState()
  // estado para mantener un arreglo de ciudades
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
      `http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`
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

  function onClose(id) {
    setCiudades((estadoAnterior) =>
      estadoAnterior.filter((el) => el.id !== id)
    );
  }

  return (
    <div className="App">
      <Nav onSearch={onSearch} />
      <Cards cities={ciudades} onClose={onClose} />
    </div>
  );
}
