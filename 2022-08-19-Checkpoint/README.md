# M2 - Checkpoint | Henry Movies

## Aclaraciones IMPORTANTES

- En este checkpoint vamos a utilizar un Back-end que fue creado con json-server. Es IMPORTANTE que sigas los pasos siguientes para que todos los test pasen bien, sino van a haber errores en ellos!
- Deberás utilizar tanto componente de clase como funcional. Utiliza cada uno donde se indique que lo hagas, sino los test fallarán.
- En caso de que utilices hooks de react, deberás usarlos de la siguiente forma `React.useState` , `React.useEffect` para que los test no fallen.
- Es importante que lean los comentarios para saber donde pueden usar hooks y donde no.

## Objetivos de la app

Construiran una página con informacion de peliculas.
Dispondrá de una página principal donde vamos a poder ver las peliculas, mostrando su imágen, nombre, director y año. tambien un botón para eliminarla.

Al hacer click en la pelicula deberá llevarnos a su detalle ("MovieDetail"), donde tendremos información del nombre, la descripción de la pelicula, el director y el año.
Como bien mencionamos en las aclarciones, dispondrán de un Backend ya creado con json-server.

Esta libreria nos permite crear una API REST con tan solo un archivo json.
Lo utilizaremos de forma tal que tengan que realizar una conexión Back-Front utilizando "fetch" o "axios" (ya viene instalado).

El objetivo de este CP es prepararlos para la instancia de lo que va a ser el Proyecto Individual (PI). Así van a poder "volver" a este CP y utilizarlo como referencia para cuando estén en esa instancia de Henry!
Recuerden que pueden volver a revisar las homeworks y el contenido teórico que se dió durante todo el módulo!

La app va a contar con tres rutas:

- **'/'** : Nuestra Home donde se van a ver todas las peliculas.
- **'/movie/:id'** : El detalle de la pelicula.
- **'/movie/create'** : El formulario de creación de una pelicula.

### Para comenzar:

`npm install`

`npm test` ( Para correr los tests. Podes pasarle como argumento el nombre del test a correr, por ejemplo: `npm test App` va a correr solamente los tests del archivo App o simplemente el numero del test `npm test 01`)

Si queres levantar la app y ver cómo va la página lo podes hacer con :

- `npm start` para levantar el front
- `npm run server` para levantar nuestro Backend.

> Recordá que para aprobar solo tienen que pasar los tests.

## REACT - REDUX

Vas a trabajar en los siguientes archivos (Cada archivo tiene su archivo de test correspondiente). Para el desarrollo de esta aplicación, te recomendamos seguir este camino:

1. App.js
2. components/Nav/Nav.jsx
3. redux/actions/index.js
4. redux/reducer/index.js
5. components/Home/Home.jsx
6. components/CreateMovie/CreateMovie.jsx
7. components/MovieCard/MovieCard.jsx
8. components/MovieDetail/MovieDetail.jsx

Vas a tener que ir leyendo **cada archivo de test por componente** y la descripción de cada uno para ir avanzando.

# Condiciones de aprobacion

Para aprobar deberán completar **_6_** de los **_8_** testsuite que se encuentran en el CP.

> Lee bien los tests y lo que piden, sobre todo los detalles.

> Esta aplicacion esta pensada para que pasen los tests, y que tenga la funcionalidad que buscamos. Tiene estilos muy simples, por favor enfocate primero en pasar los test y luego los invitamos a que le den los estilos que les gusten !

![Smart homero](https://i.pinimg.com/474x/d1/a3/0b/d1a30b97cd6828b812c3f9bbf6af65c9.jpg)
