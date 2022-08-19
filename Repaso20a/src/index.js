import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import store from "./store";
import {Provider} from "react-redux";

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
  ,
  document.getElementById('root')
);

/*
*
* Para poder trabajar con react-rotuer-dom, primero debo instalarlo, si quiero usar
* una version anterior como puede ser la 5.2 debo invocar a: npm install react-router-dom@5.2
* Luego, 'abrazar' a mi aplicacion con un Router, en este caso lo hicimos con BrowserRouter
* a quien debo importar anteriormente.
*
* Por otro lado, dado que ibamos a trabajar con react-redux, invocamos a un componente
* provisto por react-redux (que tambien debemos instalar) llamado Provider, este, recibe
* una propiedad obligatoria, que se llama store, el valor que recibe dicha prop es el store
* creado en /store/index.js por lo tanto, antes debo importarlo.
*
* */
