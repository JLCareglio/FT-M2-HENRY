import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { MemoryRouter } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import isReact from 'is-react';

import ProductDetail from '../src/components/ProductDetail/ProductDetail';
import * as data from '../db.json';
import * as actions from '../src/redux/actions';
import axios from 'axios';
import nock from 'nock';
import nodeFetch from 'node-fetch';
axios.defaults.adapter = require('axios/lib/adapters/http');

configure({ adapter: new Adapter() });

describe('<ProductDetail />', () => {
  global.fetch = nodeFetch
  let productDetail, useSelectorStub, useSelectorFn, useEffect;
  const noProd = {
    id: 1,
    name: 'Remera Henry',
    description: 'Remera 100% algodón de Soy Henry.',
    price: 120,
    image:
      'https://res.cloudinary.com/coco-mall/image/upload/v1639500774/imagen1_ng09j4.png',
    stock: 10,
  };

  const match = (id) => ({
    params: { id },
    isExact: true,
    path: '/product/:id',
    url: `/product/${id}`,
  });
  const mockStore = configureStore([thunk]);

  const store = (id) => {
    let state = {
      products: data.products.concat(noProd),
      productDetail:
        id !== 10 ? data.products[id - 1] : data.products.concat(noProd),
    };
    return mockStore(state);
  };
  // Si o si vas a tener que usar functional component! No van a correr ninguno de los tests si no lo haces!
  // También fijate que vas a tener que usar algunos hooks. Tanto de React como de Redux!
  // Los hooks de React si o si los tenes que usar "React.useState", "React.useEffect". El test no los reconoce
  // cuando se hace destructuring de estos métodos === test no corren.
  beforeAll(() => expect(isReact.classComponent(ProductDetail)).toBeFalsy());
  const mockUseEffect = () => useEffect.mockImplementation((fn) => fn());

  beforeEach(() => {
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
    useSelectorStub = jest.spyOn(ReactRedux, 'useSelector');
    useSelectorFn = (id) =>
      useSelectorStub.mockReturnValue(store(id).getState().productDetail);
    useEffect = jest.spyOn(React, 'useEffect');
    productDetail = (id) =>
      mount(
        <ReactRedux.Provider store={store(id)}>
          <MemoryRouter initialEntries={[`/products/${id}`]}>
            <ProductDetail match={match(id)} />
          </MemoryRouter>
        </ReactRedux.Provider>,
      );
    mockUseEffect();
    mockUseEffect();
  });

  afterEach(() => jest.restoreAllMocks());

  it('Debería usar un useEffect y dentro de este, dispachar la acción getProductDetail, pasandole como argumento el ID del product a renderizar', async () => {
    // Nuevamente testeamos todo el proceso. Tenes que usar un useEffect, y despachar la acción "getProductDetail".
    const useDispatch = jest.spyOn(ReactRedux, 'useDispatch');
    const getProductDetail = jest.spyOn(actions, 'getProductDetail');
    productDetail(1);
    expect(useEffect).toHaveBeenCalled();
    expect(useDispatch).toHaveBeenCalled();
    expect(getProductDetail).toHaveBeenCalled();

    productDetail(2);
    expect(useEffect).toHaveBeenCalled();
    expect(useDispatch).toHaveBeenCalled();
    expect(getProductDetail).toHaveBeenCalled();
  });

  describe('Debería recibir por props el objeto "match". Utilizar el "id" de "params" para despachar la action "getProductDetail" y renderizar los detalles del product', () => {
    const product = data.products[0];
    // Fijate que para traerte los datos desde Redux, vas a tener que usar el hook de Redux "useSelector"
    // para que los tests pasen!
    // Lo que se esta testeando aca, es que el componente renderice los detalles del todo correctamente,
    // no la estructura del componente asi que eres libre de diseñar la estructura, siempre y cuando se muestren los datos del todo.
    // Verificar la llegada de datos en el objeto "match.params", puede romper en el caso que no exista nada.
    it('Deberia renderizar el name del producto.', () => {
      useSelectorFn(1);
      expect(productDetail(1).text().includes(product.name)).toEqual(true);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
    it('Deberia rederizar el precio del producto.', () => {
      useSelectorFn(1);
      expect(productDetail(1).text().includes(product.price)).toEqual(true);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
    it('Deberia renderizar la descripción del producto.', () => {
      useSelectorFn(1);
      expect(productDetail(1).text().includes(product.description)).toEqual(
        true,
      );
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
    it('Deberia renderizar el stock del producto.', () => {
      useSelectorFn(1);
      expect(productDetail(1).text().includes(product.stock)).toEqual(true);
      expect(useSelectorStub).toHaveBeenCalled();
      expect(useEffect).toHaveBeenCalled();
    });
  });
});
