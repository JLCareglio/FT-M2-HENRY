function Tareas(datos) {
  return (
    <div>
      {datos.map((tarea) => (
        <h1>{tarea.title}</h1>
      ))}
    </div>
  );
}

export default Tareas;
