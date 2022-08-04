$("#boton").click(function () {
  document.getElementById("lista").innerHTML = "";
  $.get("http://localhost:5000/amigos", function (amigos) {
    console.log(amigos);
    amigos.forEach((amigo) => {
      let li = document.createElement("li");
      li.innerHTML = `${amigo.name} - ${amigo.age} años - ${amigo.email}`;
      document.getElementById("lista").appendChild(li);
    });
  });
});

$("#search").click(function () {
  input = document.getElementById("input");
  buscarA = "http://localhost:5000/amigos/" + input.value;
  input.value = "";
  console.log(buscarA);
  $.get(buscarA, function (amigo) {
    console.log(amigo);
    document.getElementById("amigo").innerHTML = amigo.name;
  });
});

$("#delete").click(function () {
  input = document.getElementById("inputDelete");
  eliminarA = "http://localhost:5000/amigos/" + input.value;
  input.value = "";
  console.log(eliminarA);
  $.ajax({
    url: eliminarA,
    type: "DELETE",
    success: function (result) {
      console.log(result)
    },
  });
});
