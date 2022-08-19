import React from 'react';
import {Link} from "react-router-dom";

export default function User({id, name, lastName, age, city}){
    return(
        <div>
            <div>User number: {id}</div>
            Name: <Link to={`/detail/${id}`}>{name}</Link>
            <div>Last name: {lastName}</div>
            <div>Age: {age}</div>
            <div>City: {city}</div>
        </div>
    )
}
