import React from "react";
import {createUser} from '../actions';
import {connect} from "react-redux";

export  function CreateUser({create}) {
    /*
    * Creamos un estado local que se va a encargar de alojar la informacion
    * de los inputs definidos dentro del form, la idea es que estos valores, a medida
    * que la inforamcion en el input cambie, cambien. De forma tal que al darle submit
    * se envien, en este caso, a nuestro store */

    /* Recordemos que el hook de useState sirve solo para componentes de funcion, en el
    * caso de querer tener un estado local en un componente de clase debo invocar
    * a la funcion constructora, y por lo tanto a su super. En este caso, el hook
    * devuelve un arreglo en donde en la primera posicion se aloja el valor del estado,
    * en la segunda una funcion que nos permite modificar el estado.
    *
    * Ademas, useState, recibe por parametro el valor inicial que le queremos dar a nuestro
    * estado. Por consiguiente terminamos teniendo un estado que se llam input, que es un
    * objeto y tiene las propiedad name, lastName, age, y city como un string vacio
    * */
  let [input, setInput] = React.useState({
    name: "",
    lastName: "",
    age: "",
    city: "",
  });

  /*
  * Esta funcion se invocara, en cada instancia en donde un input cambie, esto se debe
  * a que en cada input definimos un evento onChange que invoca a handleChange. Lo que
  * hace dicha funcion es tomar la propiedad name del input (distinta de la del estado local)
  * y se le reasigna a la propiedad (del estado) el valor que se aloje en el input.
  * Por lo tanto, si el input tiene una propiedad name='name', y el valor alojado en el mismo
  * es 'martina', lo que va a hacer el setInput es establecer el estado en
  * {name: 'martina',
  * lastName:'',
  * age: '',
  * city:''} (partiendo del estado inicial)
  * Luego, si hay un cambio en el input cuya propiedad name='age', el valor alojado en el
  * mismo es 25, lo que va a hacer el setInput es establecer el estado en:
  * {name: 'martina', (mantiene el valor)
  * lastName: '',
  * age: 25,
  * city: ''
  * }
  * */

  let handleChange = (e) => {
      e.preventDefault();
      console.log(e);
      setInput((prev) => ({...prev, [e.target.name]:e.target.value}))
  };

  // let dispatch = React.useDispatch();

  /*Cuando se haga click en el boton de submit, llega el momento en que se submitee el form
  * SI, puedo usar un boton comun y corriente para interpretar el mismo compoartamiento
  * y colocarle un evento del tipo onClick. En este caso como optamos por trabajar
  * con un form, nos resulto mas comodo trabajar con el evento onSubmit.
  * El comportamiento del onSubmit, es refrescar la pagina, entonces, invocamos
  * a e.prventDefault para evitar que se nos recargue la pagina al darle click.
  * Luego, despachamos una accion que previamente, habiamos conectado a nuestro componente
  * a traves de la funcion connect, lo que hacemos en definitiva, es definir la funcion
  * mapDispatchToProps y determinar que nombre le queremos dar a nuestra propiedad
  * que vaya a ser la encargada de despachar la accion. EN este caso, le colocamos el nombre
  * create (ver mapDispatchToProps abajo), hicimos destructuring y por lo tanto
  * aca, simplemente la invocamos.
  * create(input) -> dispatch(createUser(input)) -> dispatch({type: 'CREATE_USER', payload: input}) ->
  *               reducer -> cambia el estado global
  * */
  let handleSubmit = (e) => {
      e.preventDefault();
      // dispatch(createUser(input)); // {type: 'CREATE_USER', payload: input}
      create(input);
      setInput({name: '', lastName:'', age:'', city: ''})
  };


  return (
    <React.Fragment>
      <div>CREATE USER</div>
      <br />
      <form onSubmit={e => handleSubmit(e)}>
        <div>
          <label>Name</label>
          <input type={"text"} name={'name'} value={input.name}
          onChange={(e) => handleChange(e)}/>
        </div>
        <div>
          <label>Last name</label>
          <input type={"text"} name={'lastName'} value={input.lastName}
          onChange={(e) => handleChange(e)}/>
        </div>
        <div>
          <label>Age</label>
          <input type={"text"} name={"age"} value={input.age}
          onChange={(e) => handleChange(e)}/>
        </div>
        <div>
          <label>City</label>
          <input type={"text"} name={"city"} value={input.city}
          onChange={(e) => handleChange(e)}/>
        </div>
          <br/>
        <input type={'submit'} value={'CREATE'}/>
      </form>
    </React.Fragment>
  );
}

/*Comienza la magia de redux:
*   como no necesitamos nada del store, no uso nada del store en si, ni el arreglo, ni el details,
*   no necesito tener ningun mapStateToProps. Solo me importa conectar a mi componente
*   a traves de props el actionCreator createUser. Defino la funcion mapDispatchToProps,
*   esta recibe dispatch, 'se la brinda connect', y devuelve un objeto
*   que la propiedad define el nombre con el cual el componente va a recibir dicha prop.
* */


function mapDispatchToProps(dispatch){
    return {
        create: (input) => dispatch(createUser(input))
    }
}

export default connect(null, mapDispatchToProps)(CreateUser)
// <CreateUser create={(input) => dispatch(createUser(input))}>


// {key: value}
// let obj = {name: 'martina', lastName: 'scomazzon', age: 25}

// obj.name -> 'martina'
// obj.lastName -> 'scomazzon'
// obj.age -> 25

// let value = 'name'
// obj.'name' -> obj['name'] -> obj.name ? -> 'martina'

// let value = 'city'
// obj[value] = 'caba'
// ? obj = {name: 'martina', lastName: 'scomazzon', age: 25, city:'caba'}
