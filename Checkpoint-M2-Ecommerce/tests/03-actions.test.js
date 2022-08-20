/* eslint-disable jest/no-conditional-expect */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAIL,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  getAllProducts,
  getProductDetail,
  createProduct,
  deleteProduct,
} from '../src/redux/actions';
import * as data from '../db.json';
import axios from 'axios';
import nock from 'nock';
import nodeFetch from 'node-fetch'
axios.defaults.adapter = require('axios/lib/adapters/http');

describe('Actions', () => {
  const mockStore = configureStore([thunk]);
  const store = mockStore({ products: [] });
  global.fetch = nodeFetch
  beforeEach(() => {
    store.clearActions();

    // Se Mockea las request a las api
    const apiMock = nock('http://localhost:3001').persist();

    // "/products" => Retorna la propiedad products del archivo data.json
    apiMock.get('/products').reply(200, data.products);

    // "/products/:id" => Retorna un producto matcheado por su id
    apiMock.get(/\/products\/\d/).reply(200, (uri, requestBody) => {
      const idStr = uri.split('/').pop();
      const id = Number(idStr);
      return data.products.find((product) => product.id === id);
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  

  describe('getAllProducts', () => {
    it('Debería hacer un dispatch con las propiedades type "GET_ALL_PRODUCTS" y como payload, el resultado del fetch al link provisto', async () => {
      return store
        .dispatch(getAllProducts())
        .then(() => {
          const actions = store.getActions();
          expect(actions[0].payload.length).toBe(5);
          expect(actions[0]).toEqual({
            type: GET_ALL_PRODUCTS,
            payload: data.products,
          });
        })
        .catch((err) => {
          // En caso de que haya un error al mandar la petición al back, el error entrara aquí. Podrás visualizarlo en la consola.

          console.error(err);
          expect(err).toBeUndefined();
        });
    });
  });

  describe('getProductDetail', () => {
    it('Debería hacer un dispatch con las propiedades type "GET_PRODUCT_DETAILS" y como payload, el resultado del fetch al link provisto', async () => {
      const payload = data.products[0];
      return store
        .dispatch(getProductDetail(payload.id))
        .then(() => {
          const actions = store.getActions();
          expect(actions[0]).toStrictEqual({
            type: GET_PRODUCT_DETAIL,
            payload: { ...payload },
          });
        })
        .catch((err) => {
          // El catch lo utilizamos para "agarrar" cualquier tipo de errores a la hora de hacer la petición al back. Solo va a entrar si el test no sale como es pedido.
          // Para ver que está pasando deberías revisar la consola.
          console.error(err);
          expect(err).toBeUndefined();
        });
    });

    it('Debería traer un producto distinto si el id requerido es otro (evitar hardcodeos)', async () => {
      const payload = data.products[1];
      return store
        .dispatch(getProductDetail(payload.id))
        .then(() => {
          const actions = store.getActions();
          expect(actions[0]).toStrictEqual({
            type: GET_PRODUCT_DETAIL,
            payload: { ...payload },
          });
        })
        .catch((err) => {
          // El catch lo utilizamos para "agarrar" cualquier tipo de errores a la hora de hacer la petición al back. Solo va a entrar si el test no sale como es pedido.
          // Para ver que está pasando deberías revisar la consola.
          console.error(err);
          expect(err).toBeUndefined();
        });
    });
  });

  describe('createProduct', () => {
    it('Debería retornar una action con las propiedades type "CREATE_PRODUCT" y payload: contiene los values recibidos como argumento y un ID incremental en la action creator "createProduct"', () => {
      // Para que este test pase, deberan declarar una variable id que su valor inicialice en 6. Lo hacemos para que no haya conflicto entre los id's que nosotros ya tenemos.
      // Si revisan el archivo db.json verán la lista de productos.
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

      expect(createProduct(payload1)).toEqual({
        type: CREATE_PRODUCT,
        payload: {
          id: 6,
          name: 'Gorra Henry',
          description: 'Tapa todo menos los booms',
          price: 500,
          image: 'url',
          stock: 20,
        },
      });

      expect(createProduct(payload2)).toEqual({
        type: 'CREATE_PRODUCT',
        payload: {
          id: 7,
          name: 'Stickers Henry',
          description: 'Se pegan a cualquier superficie',
          price: 10,
          image: 'url',
          stock: 200,
        },
      });
    });
  });

  describe('deleteProduct', () => {
    it('Debería retornar una action con las propiedades type "DELETE_PRODUCT" y como payload el id del producto a eliminar. Recibe el id por argumento', () => {
      expect(deleteProduct(1)).toEqual({ type: DELETE_PRODUCT, payload: 1 });
      expect(deleteProduct(2)).toEqual({ type: DELETE_PRODUCT, payload: 2 });
    });
  });
});
