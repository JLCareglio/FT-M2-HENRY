import React from "react";
import { connect } from "react-redux";
import User from "./User";
import {deleteUser} from "../actions";

export function Users(props) {
    console.log(props);
    // let dispatch = useDispatch();

  let handleClick = (e, id) => {
    e.preventDefault();
    props.delete(id);
  };

  return (
    <div>
      {props.users &&
        props.users.map((u) => (
          <div>
            <User
              key={u.id}
              id={u.id}
              name={u.name}
              lastName={u.lastName}
              age={u.age}
              city={u.city}
            />
              <button onClick={(e)=>handleClick(e, u.id)}>ELIMINAR</button>
            <br />
            <br />
          </div>
        ))}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch){
    return {
        delete: id => dispatch(deleteUser(id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);

// 5 && 2
// si el primero es true -> me voy a evaluar el 2 -> ejecutando el 2
// si el  es falso -> false primero
