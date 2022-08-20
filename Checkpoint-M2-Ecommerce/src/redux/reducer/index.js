// Importa las action types acá
import { act } from "react-dom/test-utils";
import { GET_ALL_PRODUCTS, CREATE_PRODUCT,DELETE_PRODUCT,GET_PRODUCT_DETAIL } from "../actions";
const initialState = {
  products: [],
  productDetail: {},
};

const rootReducer = (state = initialState, action) => {
  switch (
    action.type
    // Acá va tu código:
  ) 
};

export default rootReducer;
