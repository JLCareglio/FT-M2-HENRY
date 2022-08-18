import React from "react";
import { useParams } from "react-router-dom";
import Style from "./Ciudad.css";

export default function Ciudad({ onFilter }) {
  // acceder al parametro
  // useParams() --> objeto que adentro tiene (entre otras ) los parametros --> {id: "algo"}
  const { id } = useParams();
  var city = onFilter(id);
  // filtrar las ciudades para conseguir la que tenemos que mostrar

  if (city) {
    return (
      <div className="ciudad">
        <div className="container">
          <h2>{city.name}</h2>
          <div className="info">
            <div>Temperatura: {city.temp} ºC</div>
            <div>Clima: {city.weather}</div>
            <div>Viento: {city.wind} km/h</div>
            <div>Cantidad de nubes: {city.clouds}</div>
            <div>Latitud: {city.latitud}º</div>
            <div>Longitud: {city.longitud}º</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>No se encontro</h1>
      </div>
    );
  }
}
