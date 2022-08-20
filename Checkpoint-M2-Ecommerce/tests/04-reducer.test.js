import rootReducer from '../src/redux/reducer';
import {
   createProduct,
   deleteProduct,
   GET_ALL_PRODUCTS,
   GET_PRODUCT_DETAIL,
} from '../src/redux/actions';
import * as data from '../db.json';

describe('Reducer', () => {
   const state = {
      products: [],
      productDetail: {},
   };

   it('Debería retornar el estado inicial si no se pasa un type válido', () => {
      expect(rootReducer(undefined, [])).toEqual({
         products: [],
         productDetail: {},
      });
   });

   it('Debería guardar en nuestro state los productos obtenidos de nuestro llamado al back cuando action type es "GET_ALL_PRODUCTS"', () => {
      const result = rootReducer(state, {
         type: GET_ALL_PRODUCTS,
         payload: data.products,
      });
      // Acuerdense que el state inicial no tiene que mutar!
      expect(result).not.toEqual(state);
      expect(result).toEqual({
         products: data.products, // Cuando ejecutes los tests, vas a ver bien lo que espera que le llegue a nuestro estado!
         productDetail: {},
      });
   });

   it('Debería guardar en nuestro state el product obtenido de nuestro llamado al back cuando action type es "GET_PRODUCT_DETAIL"', () => {
      const result = rootReducer(state, {
         type: GET_PRODUCT_DETAIL,
         payload: data.products[0],
      });
      // Acuerdense que el state inicial no tiene que mutar!
      expect(result).not.toEqual(state);
      expect(result).toEqual({
         products: [],
         productDetail: data.products[0],
      });
   });

   it('Debería crear un nuevo producto y guardarlo en nuestro estado de productos cuando action type es "CREATE_PRODUCT"', () => {
      const state = {
         products: data.products,
         productDetail: {},
      };

      const payload1 = {
         name: 'Gorra Henry',
         description: 'Tapa todo menos los booms',
         price: 500,
         image: 'url',
         stock: 20,
      };

      const payload2 = {
         name: 'Stickers Henry',
         description: 'Se pegan a cualquier superficie',
         price: 10,
         image: 'url',
         stock: 200,
      };

      const allProductsType1 = [
         ...data.products,
         {
            id: 6,
            name: 'Gorra Henry',
            description: 'Tapa todo menos los booms',
            price: 500,
            image: 'url',
            stock: 20,
         },
      ];
      const allProductsType2 = [
         ...allProductsType1,
         {
            id: 7,
            name: 'Stickers Henry',
            description: 'Se pegan a cualquier superficie',
            price: 10,
            image: 'url',
            stock: 200,
         },
      ];
      const firstProduct = rootReducer(state, createProduct(payload1));
      const secondProduct = rootReducer(
         { ...state, products: allProductsType1 },
         createProduct(payload2),
      );

      // Acuerdense que el state inicial no tiene que mutar!
      expect(firstProduct).not.toEqual(state);
      expect(secondProduct).not.toEqual(state);

      expect(firstProduct).toEqual({
         productDetail: {},
         products: allProductsType1,
      });
      expect(secondProduct).toEqual({
         productDetail: {},
         products: allProductsType2,
      });
   });

   it('Debería eliminar un product de nuestro store cuando action type es "DELETE_PRODUCT"', () => {
      
    // Caso 1
      const payload = 1;
      const state = {
         products: [
            {
               id: 1,
               name: 'Stickers Henry',
               description: 'Se pegan a cualquier superficie',
               price: 10,
               image: 'url',
               stock: 200,
            },
         ],
         productDetail: {},
      };

      expect(rootReducer(state, deleteProduct(payload))).toEqual({
         products: [],
         productDetail: {},
      });

      //Caso 2
      const payload2 = 6;
      const state2 = {
         products: [
            {
               id: 1,
               name: 'Stickers Henry',
               description: 'Se pegan a cualquier superficie',
               price: 10,
               image: 'url',
               stock: 200,
            },
            {
               id: 6,
               name: 'Gorra Henry',
               description: 'Tapa todo menos los booms',
               price: 500,
               image: 'url',
               stock: 20,
            },
         ],
         productDetail: {},
      };

      expect(rootReducer(state2, deleteProduct(payload2))).toEqual({
         products: [
            {
               id: 1,
               name: 'Stickers Henry',
               description: 'Se pegan a cualquier superficie',
               price: 10,
               image: 'url',
               stock: 200,
            },
         ],
         productDetail: {},
      });
   });
});
