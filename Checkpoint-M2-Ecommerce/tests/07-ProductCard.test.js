import React from 'react';
import { MemoryRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProductCardConnected from '../src/components/ProductCard/ProductCard';
import * as actions from '../src/redux/actions/index';
import * as data from '../db.json';

configure({ adapter: new Adapter() });

describe('<ProductCard />', () => {
  let productCard, state, store;
  const mockStore = configureStore([thunk]);
  let products = data.products;
  state = {
    products: [],
    productDetails: {},
  };
  store = mockStore(state);
  beforeEach(() => {
    productCard = (product) =>
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <ProductCardConnected
              id={product.id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              image={product.image}
            />
          </MemoryRouter>
        </Provider>,
      );
  });

  afterEach(() => jest.restoreAllMocks());

  describe('Estructura', () => {
    it('Debería renderizar un "button" con el texto "x"', () => {
      const wrapper = productCard(products[0]);
      expect(wrapper.find('button').text()).toBe('x');
    });

    it('Debería renderizar un tag "h3" que muestre lo que contiene el "name" de cada "Product"', () => {
      expect(productCard(products[0]).find('h3').at(0).text()).toBe(
        'Remera Henry',
      );
      expect(productCard(products[1]).find('h3').at(0).text()).toBe(
        'Lapicera Henry',
      );
      expect(productCard(products[2]).find('h3').at(0).text()).toBe(
        'Agenda Henry',
      );
    });

    it('Debería renderizar la imágen de cada producto y un alt con el nombre del respectivo producto', () => {
      expect(productCard(products[0]).find('img').prop('src')).toBe(
        products[0].image,
      );
      expect(productCard(products[0]).find('img').prop('alt')).toBe(
        products[0].name,
      );
      expect(productCard(products[1]).find('img').prop('src')).toBe(
        products[1].image,
      );
      expect(productCard(products[1]).find('img').prop('alt')).toBe(
        products[1].name,
      );
    });

    it('Debería renderizar un tag "p" que contenga el texto "Stock: " más la prop "stock" de cada "Product"', () => {
      expect(productCard(products[0]).find('p').at(0).text()).toBe('Stock: 10');
      expect(productCard(products[1]).find('p').at(0).text()).toBe('Stock: 50');
      expect(productCard(products[2]).find('p').at(0).text()).toBe('Stock: 5');
      expect(productCard(products[3]).find('p').at(0).text()).toBe('Stock: 8');
      expect(productCard(products[4]).find('p').at(0).text()).toBe('Stock: 3');
    });

    it('Debería renderizar un "p" que contenga el texto "Precio: $" más la prop "price" de cada "Product"', () => {
      expect(productCard(products[0]).find('p').at(1).text()).toBe(
        'Precio: $120',
      );
      expect(productCard(products[1]).find('p').at(1).text()).toBe(
        'Precio: $60',
      );
      expect(productCard(products[2]).find('p').at(1).text()).toBe(
        'Precio: $100',
      );
      expect(productCard(products[3]).find('p').at(1).text()).toBe(
        'Precio: $110',
      );
      expect(productCard(products[4]).find('p').at(1).text()).toBe(
        'Precio: $200',
      );
    });

    it('Debería renderizar un componente <Link> que encierre el "name" de cada "Product" y debería redirigir a "/product/:productId"', () => {
      // El valor de "productId" lo tenes que sacar del objeto products, tiene una propiedad "id".
      expect(productCard(products[0]).find(Link)).toHaveLength(1);
      expect(productCard(products[0]).find(Link).at(0).prop('to')).toEqual(
        '/product/1',
      );
    });
  });

  describe('Dispatch to store', () => {
    it("Debería hacer un dispatch al store utilizando la action 'deleteProduct' al hacer click en el boton previamente creado para poder eliminar un producto. Debe pasarle el Id del producto", () => {
      const deleteProductSpy = jest.spyOn(actions, 'deleteProduct');
      const productCard = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ProductCardConnected
              id={products[0].id}
              name={products[0].name}
              price={products[0].price}
              stock={products[0].stock}
            />
          </MemoryRouter>
        </Provider>,
      );
      productCard.find('button').simulate('click');
      expect(deleteProductSpy).toHaveBeenCalled();
      expect(deleteProductSpy).toHaveBeenCalledWith(products[0].id);

      const productCard2 = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ProductCardConnected
              id={products[1].id}
              name={products[1].name}
              price={products[1].price}
              stock={products[1].stock}
            />
          </MemoryRouter>
        </Provider>,
      );
      productCard2.find('button').simulate('click');
      expect(deleteProductSpy).toHaveBeenCalled();
      expect(deleteProductSpy).toHaveBeenCalledWith(products[1].id);
    });
  });
});
