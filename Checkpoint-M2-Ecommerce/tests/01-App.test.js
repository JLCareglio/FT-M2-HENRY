import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import * as data from '../db.json';
import App from '../src/App';
import Nav from '../src/components/Nav/Nav';
import Home from '../src/components/Home/Home';
import ProductCard from '../src/components/ProductCard/ProductCard';
import ProductDetail from '../src/components/ProductDetail/ProductDetail';
import CreateProduct from '../src/components/CreateProduct/CreateProduct';
import axios from 'axios';
import nock from 'nock';
import nodeFetch from 'node-fetch';
axios.defaults.adapter = require('axios/lib/adapters/http');

configure({ adapter: new Adapter() });

describe('<App />', () => {
  global.fetch = nodeFetch;

  let store;
  const routes = ['/', '/product/1', '/products/create'];
  const mockStore = configureStore([thunk]);
  const state = {
    products: data.products,
    productDetail: data.products[0],
  };

  beforeEach(async () => {
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

    store = mockStore(state);
  });

  const componentToUse = (route) => {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  };
  describe('Nav:', () => {
    it('Debería ser renderizado en la ruta "/"', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(Nav)).toHaveLength(1);
    });

    it('Debería ser renderizado en la ruta "/product/:id"', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Nav)).toHaveLength(1);
    });
    it('Debería ser renderizado en la ruta "/products/create"', () => {
      const app = mount(componentToUse(routes[2]));
      expect(app.find(Nav)).toHaveLength(1);
    });
  });

  describe('Home:', () => {
    it('El componente "Home" se debería renderizar solamente en la ruta "/"', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(ProductDetail)).toHaveLength(0);
      expect(app.find(CreateProduct)).toHaveLength(0);
      expect(app.find(Home)).toHaveLength(1);
      expect(app.find(Nav)).toHaveLength(1);
    });
    it('El componente "Home" no deberia mostrarse en ninguna otra ruta', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Home)).toHaveLength(0);

      const app2 = mount(componentToUse(routes[2]));
      expect(app2.find(Home)).toHaveLength(0);
    });
  });

  describe('ProductDetail:', () => {
    it('La ruta "/product/:id" deberia mostrar solo el componente ProductDetail', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Home)).toHaveLength(0);
      expect(app.find(ProductCard)).toHaveLength(0);
      expect(app.find(ProductDetail)).toHaveLength(1);
    });
  });

  describe('CreateProduct:', () => {
    it('La ruta "/products/create deberia mostrar solo el componente CreateProduct"', () => {
      const app = mount(componentToUse(routes[2]));
      expect(app.find(CreateProduct)).toHaveLength(1);
      expect(app.find(ProductCard)).toHaveLength(0);
      expect(app.find(Nav)).toHaveLength(1);
      expect(app.find(Home)).toHaveLength(0);
    });
  });
});
