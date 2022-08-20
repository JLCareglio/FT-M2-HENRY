# Henry

## M2 - Checkpoint

## Aclaraciones IMPORTANTES

- Se va a implementar el uso de un Back-end creado con json-server. Seguir los pasos luego de estas aclaraciónes, de lo contrario algunos de los tests van a arrojar errores al correrlos!
- Te pediremos que utilices un componente de clase o funcional (Class component o Functional component). Utilizar solamente los exigidos, de lo contrario los tests no van a pasar!
- Si utilizan hooks de React, van a tener que usarlos de la forma `React.useState`, `React.useEffect` para que corran los tests.

## Completa la aplicación

Esta aplicación está ambientada en Equipos de Formula 1. Tiene una página principal que nos va a mostrar algunos teams (equipos) de la formula 1 y algo de información sobre ellos. Al clickear en algun equipo, iremos a un "TeamDetail" que nos va a mostrar mas detalles sobre el equipo, como por ejemplo: los conductores o campeonatos que pertenecen a dicho equipo.
Te vamos a dar un Backend ya creado que está hecho con json-server. Esta librería nos permite crear una API REST con un simple archivo json. Vamos a usar esto para realizar una conexión Back-Front utilizando "fetch" o "axios" (ya instalado).
La idea de este CP es prepararlos para lo que va a ser el Proyecto Individual (PI). Así van a poder "volver" a este CP y utilizarlo como referencia para cuando estén en esa instancia de Henry!
Recordá que podes chequear las homeworks y el contenido teórico dado durante el módulo!

La aplicación va a contar con tres rutas:

- **"/"**: Sería nuestra home, acá veremos todos los equipos.
- **"/teams/:teamId"**: Acá vamos a ver en detalle nuestro equipo
- **"/team/create"**: Acá vamos a renderizar un formulario para la creación de un equipo.

Para comenzar:

`npm install`

`npm test` ( Para correr los tests. Podes pasarle como argumento el nombre del test a correr. Por ejemplo, `npm run test:01` va a correr solamente los tests del archivo App )

Para levantar la app, por si queres ver cómo va la página (recordá que para aprobar tienen que pasar los tests):

`npm start`

Abrí otra terminal y ejecuta:

`npm run server` ( Corre nuestro Backend, este servicio lo tenes que dejar corriendo. CUIDADO, si lo dejas corriendo mientras haces el checkpoint, el script para correr los tests va a romper! )

## REACT - REDUX

Vas a trabajar en los siguientes archivos (Cada archivo tiene su archivo de test correspondiente). Para el desarrollo de esta aplicación, te recomendamos seguir este camino:

1. App.js
2. components/Nav/Nav.jsx
3. redux/actions/index.js
4. redux/reducer/index.js
5. components/Teams/Teams.jsx
6. components/TeamCard/TeamCard.jsx
7. components/TeamDetail/TeamDetail.jsx
8. components/DetailCard/DetailCard.jsx
9. components/CreateTeam/CreateTeam.jsx

Vas a tener que ir leyendo **cada archivo de test por componente** y la descripción de cada uno para ir avanzando.

> Los tests se encuentran comentados. Para poder correrlos tendras que cambiar el `xdescribe` de cada archivo .test.js por `describe`.

> Lee bien los tests y lo que piden, sobre todo los detalles.

> Esta aplicacion esta pensada para que pasen los tests, y que tenga la funcionalidad que buscamos, NO tiene estilos por lo que los componentes se veran muy precarios. Luego de rendir, los animo a que le den los estilos que gusten!

> Debes completar 7 de los 9 tests suites que se encuentran en el CP

TODO EL ÉXITO GENTE, VAMOS QUE LA ROMPEN!!
