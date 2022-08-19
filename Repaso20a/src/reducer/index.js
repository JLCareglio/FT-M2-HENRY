let index = 1;

const initialState = {
    users: [],
    detail: {}
};

// STATE primer parametro !
// ACTION segundo parametro !
export default function rootReducer(state=initialState, action){
    switch(action.type){
        case 'CREATE_USER':
            return {
                ...state,
                // users: state.users.concat(action.payload)
                // users: [{}, {}, {}]
                users: [...state.users, {...action.payload, id: index++}]
            };
        case 'SET_DETAIL':
            return{
                ...state,
                detail: action.payload
            };
        case 'DELETE_USER':
            return {
                ...state,
                users: state.users.filter(u => u.id !== action.payload)
            };
        default: return {...state}
    }
}

/*
* Aqui definimos el estado inicial, lo podemos llamar como querramos, en este caso
* lo llamamos initialState, se inidcan los valores iniciales que queremos que tenga nuestro
* store.
*
* Por otro lado, el reducer en si mimos, que es el mismo que le pasamos a createStore.
* El reducer, es una funcion, que recibe en su PRIMER parametro, el state y con un valor
* default, inicial, de initialState. Y en el SEGUNDO parametro recibe el action, que vendra
* del dispatch.
*
* NO OLVIDAR DE DEFINIR EL VALOR POR DEFAULT DEL SWITCH, TAMPOCO EL DEL STATE !
*
* Cada action, va a tener un type, dicho type es analizado, y dependiendo del type del action
* es lo que suceda dentro del estado. Por lo tanto el type, o la accion, no es mas
* que una descripcion de lo que deseo que suceda. El action, tiene la propiedad type, pero ademas
* podria traer consigo, cualquier otra propiedad, se puede llamar payload, tito, tita
* lo que fuere, y tantas como quiera.
*
* Cuando devuelvo el estado, no olvidemos de hacer una copia del estado anterior (con el spread)
* y luego redefinir la propiedad que buscamos cambiar. Recordar que preferentemente, segun
* las buenas practicas de react-redux, debemos hacer la 'logica' en el reducer y no
* en los action creators.
*
* */
