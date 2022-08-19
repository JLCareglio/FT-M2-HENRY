import React from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import {getPost} from "../actions";

export function Details(props){
    // props.match.params.id
    // useParams
    let params = props.match.params.id;
    // let paramsHooks = React.useParams();

    // let dispatch = useDispatch(); // store.dispatch()
    // // mapStateToProps
    // let detail = useSelector(state => state.detail); // props.detail
    // let users = useSelector(state => state.users);  // props.users


    /*Como la dependencia es vacia, se va a ejecutar una unica vez, viene
    * a simular el componentDidMount de un componente de clase.
    * Lo que hace en este caso es ir a buscar a una api, un posteo que corresponda
    * con el id pasado por url. Notemos que el valor lo tomamos a traves de props.params.match.id*/
    React.useEffect(() => {
        props.getDetail(params);
    }, []);

    return (<div>
        El usuario numero {params}
        {
            props.detail ? (<div>
                {props.detail.id}
                {props.detail.title}
                {props.detail.body}
            </div>) : null
        }
    </div>)
}

/* Conectamos el componente con el store, mapStateToProps para obtener info del estado,
* mapDispatchToProps para que se nos de el 'poder' de hacer cambios en el store */
function mapStateToProps(state){
    return{
        detail: state.detail,
        users: state.users
    }
}

function mapDispatchToProps(dispatch){
    return {
        getDetail: id => dispatch(getPost(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details)


