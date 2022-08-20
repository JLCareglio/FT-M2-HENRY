import React from "react";
import { Route } from 'react-router-dom';
import Nav from "./components/Nav/Nav";
import Teams from "./components/Teams/Teams";
import TeamDetail from "./components/TeamDetail/TeamDetail";
import CreateTeam from "./components/CreateTeam/CreateTeam";

function App() {
  return (
    <React.Fragment>
      <Nav />
      <Route exact path={"/"} component={Teams} />
      <Route exact path={"/teams/:teamId"} component={TeamDetail} />
      <Route exact path={"/team/create"} component={CreateTeam} />
    </React.Fragment>
  );
}

export default App;
