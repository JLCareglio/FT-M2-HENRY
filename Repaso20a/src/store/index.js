import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducer";
import thunk from "redux-thunk";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)));

export default store;

/*
* Necesitamos crear el store, por lo tanto invocar a createStore del paquete redux,
* por lo tanto, no nos olvidemos de hacer previamente npm redux.
*
* Para poder trabajar con las consultas a la api y el store en simulanteo, vamos a necesitar
* de un middleware que se enecargue de capturar las actionCreators que devuelvan thunk-functiosn
* para luego procesarlas como tal, y una vez que la api haya dado respuesta hacer
* el dispatch correspondiente con la info
*
* El window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ nos permite activar el react redux dev too
* clave para poder saber que valores hay alojados en el store, que valores recibe cada accion
* y fundamentalmente, que accion fue dispatchada
*
* */
