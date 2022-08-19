import './App.css';
import React from 'react';
import NavBar from "./components/NavBar";
import {Route} from "react-router-dom";
import Home from "./components/Home";
import CreateUser from "./components/CreateUser";
import Details from "./components/Details";
import Users from "./components/Users";
import About from "./components/About";

function App() {
  return (
    <React.Fragment>
      <NavBar/>
      <Route path={'/home'}>
        <Home name={'Martina'} age={'25'} city={'CABA'}/>
      </Route>
      <Route path={'/create'} component={CreateUser}/>
      <Route path={'/users'} component={Users}/>
      <Route path={'/detail/:id'} component={Details}/>
      <Route path={'/about'} component={About}/>
    </React.Fragment>
  );
}

export default App;

/*
* Componente de funcion, el return representa la funcion render() dentro de un componente
* de clase.
* En este caso, estamos indicando que el componente <NavBar/> se debe renderizar en todas
* las rutas, podria tambien haberlo indicado con un Route y un path={'/'} sin el exact.
*
* Cada Route, tiene como propiedad path, donde indico el path en el cual se tiene que
* parar para renderizar determinado componente.
* El componente a renderizar, la forma en que lo indico depende si le paso o no props.
* Si no le voy a pasar props, puedo directamente hacerlo con la prop component, sino,
* debo hacerlo con children o render, o en su defecto 'abrazar' el component en Route.
*
* Por ultimo, observamos el React.Fragment, un componente de react que nos permite enviar
* unico elemento, sin el uso de div
*
* */
