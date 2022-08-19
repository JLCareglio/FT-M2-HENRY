export function createUser(info){
     return {type: 'CREATE_USER', payload: info}
}

export function getPost(id){
     /*thunk - function */
     return function(dispatch){
          return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
              .then(response => response.json())
              .then(post => dispatch({type: 'SET_DETAIL', payload: post}))
     }
}

export function deleteUser(id){
     return {type:'DELETE_USER', payload: id}
}


/*
* ACTION CREATORS:
* Funciones creadoras de acciones, las acciones son objetos que tienen una propiedad
* type que describen que tipo de accion se debera llevar a cabo en el reducer. Ademas, puede
* contenter cualquier otra propiedad que sirva para 'transportar' informacion hacia
* el reducer.
*
* Cuando estamos trabajando con una api, NO podemos realizar dicha consulta dentro
* del reducer. Es por ello, que utilizamos el thunk-middleware, la idea es que
* el action creator, devuelva una funcion, que recibe el dispatch, que invoca a la api
* y termina por devolver un dispatch con, la informacion obtenida, y obviamente, el tipo.
* Dicho dispatch, viaja hacia el reducer, pero ahora ya con la informacion.
*
* */
