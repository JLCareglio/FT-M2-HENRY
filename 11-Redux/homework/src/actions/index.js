export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

// Nuestras actions (action creators) devolverán un paquete de actions que nuestro reducer recibirá.
// ¿Cómo es el paquete de acción? Tengan en cuenta que el creador de la acción no es en absoluto responsable
// de manejar ninguna de las lógicas actuales de actualización del store central de Redux.
// Eso se lo deja al reducer(s).

export const increment = (valor) => {
  // Completa la funcion
  return {
    type: INCREMENT,
    payload: valor,
  };
};

export const decrement = () => {
  // Completa la funcion
  return {
    type: DECREMENT,
    payload: 1,
  };
};
