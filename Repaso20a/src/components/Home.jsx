import React from 'react';

export default class Home extends React.Component{

    render(){
        let {name, age} = this.props;
        return(
            <div>
                HOME {name} {age}
            </div>
        )
    }
}


// CICLO DE VIDA DE UN COMPONENTE !
// 1. CONSTRUCTOR
// 2. RENDER
// 3. COMPONENTDIDMOUNT(solo componentes de clase) //
//      useEffect(()=> {},[]) (solo componentes de funcion)

// POSIBLES CAMBIOS
// HUBO UN CAMBIO EN UN VALOR DE UNA PROP? HUBO UN CAMBIO EN UN ESTADO?
// HUBO UN FORCEUPDATE()?
// UPDATE
    // 1. SHOULDCOMPONENTUPDATE (componente de clase) -> true/false
    // 2. RENDER() !! NO SE VUELVE A EJECUTAR EL CONSTRUCTOR() !!
    // 3. DIDCOMPONENTUPDATE (componente de clase) // useEffect(()=>{}, [dependencies])

// SI EL COMPONENTE VA A DESAPARECER DEL DOM
// count < 5 <Counter/> : null
// DOM: <Counter/>
// DOM posterior: null
// OHHHHH COMPONENTWILLUNMOUNT() (componente de clase) // useEffect(()=>return()=>{}) componente de funcion

