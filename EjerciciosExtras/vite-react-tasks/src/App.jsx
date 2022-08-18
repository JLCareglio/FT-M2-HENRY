import { useState } from "react";
import Tareas from "./components/Tareas";
import TareasForm from "./components/TareasForm";
import { data } from "./data.js";

const [datos, setDatos] = useState([]);

function App() {
  return (
    <>
      <TareasForm />
      <Tareas datos={datos} />
    </>
  );
}

export default App;
