import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deleteTeam } from "../../redux/actions";

// CUIDADO!. SI O SI CLASS COMPONENT! SE ROMPEN LOS TEST EN CASO CONTRARIO!
// TAMBIEN VAS A TENER QUE USAR EL METODO CONNECT DE REDUX , JUNTO A MAP_DISPATCH_TO_PROPS!
export class TeamsCard extends Component {
  render() {
    const { name, image, id, base, founder } = this.props
    return <div>
      <button onClick={e => { this.props.deleteTeam(id)}}></button>
      <img src={image} />
      <p>Founder: {founder}</p>
      <p>Base: {base}</p>
      <Link to={`/teams/${id}`}>
        <h3>{name}</h3>
      </Link>
    </div>;
  }
}

export const mapDispatchToProps = {deleteTeam} 

export default connect(null, mapDispatchToProps)(TeamsCard);
