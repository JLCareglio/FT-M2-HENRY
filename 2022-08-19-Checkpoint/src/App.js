import React from "react";
import { Route } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import MovieDetail from "./components/MovieDetail/MovieDetail";
import CreateMovie from "./components/CreateMovie/CreateMovie";

function App() {
  return (
    <>
      <Nav />
      <Route exact path="/" component={Home} />
      <Route path="/movie/:id" component={MovieDetail} />
      <Route path="/movies/create" component={CreateMovie} />
    </>
  );
}
export default App;
