import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import isReact from 'is-react';

import * as data from '../db.json';
import * as actions from '../src/redux/actions';

import CreateProduct from '../src/components/CreateProduct/CreateProduct';

configure({ adapter: new Adapter() });

describe('<CreateProduct/>', () => {
   const state = { products: data.products };
   const mockStore = configureStore([thunk]);
   const { CREATE_PRODUCT } = actions;

   beforeAll(() => expect(isReact.classComponent(CreateProduct)).toBeFalsy());

   // RECUERDEN USAR FUNCTIONAL COMPONENT EN LUGAR DE CLASS COMPONENT
   describe('Formulario de creación de producto', () => {
      let createProduct;
      let store = mockStore(state);
      beforeEach(() => {
         createProduct = mount(
            <Provider store={store}>
               <MemoryRouter initialEntries={['/products/create']}>
                  <CreateProduct />
               </MemoryRouter>
            </Provider>,
         );
      });

      it('Debe renderizar un formulario', () => {
         expect(createProduct.find('form').length).toBe(1);
      });

      it('Debe renderizar un label para el nombre con el texto "Name: "', () => {
         expect(createProduct.find('label').at(0).text()).toEqual('Name: ');
      });

      it('Debe renderizar un input para con la propiedad "name" igual a "name', () => {
         expect(createProduct.find('input[name="name"]').length).toBe(1);
      });

      it('Debe renderizar un label para el precio con el texto "Price:', () => {
         expect(createProduct.find('label').at(1).text()).toBe('Price: ');
      });

      it('Debe renderizar un input de tipo number para con la propiedad "name" igual a "price"', () => {
         expect(createProduct.find('input[name="price"]').length).toBe(1);
         expect(createProduct.find('input[type="number"]').length).toBe(2);
      });
      it('Debe renderizar un label para la descripción con el texto "Description:', () => {
         expect(createProduct.find('label').at(2).text()).toBe('Description: ');
      });
      it('Debe renderizar un textarea con la propiedad name igual a "description"', () => {
         expect(createProduct.find('textarea[name="description"]').length).toBe(
            1,
         );
      });

      it('Debe renderizar in label para el stock con el texto "Stock: "', () => {
         expect(createProduct.find('label').at(3).text()).toEqual('Stock: ');
      });
      it('Debe renderizar un input de tipo number para con la propiedad "name" igual a "stock', () => {
         expect(createProduct.find('input[name="stock"]').length).toBe(1);
         expect(createProduct.find('input[type="number"]').length).toBe(2);
      });

      it('Debería renderizar un input de button submit y con texto "Create Product"', () => {
         expect(createProduct.find('button[type="submit"]').length).toBe(1);
         expect(createProduct.find('button[type="submit"]').text()).toBe(
            'Create Product',
         );
      });
   });

   describe('Manejo de estados locales', () => {
      let useState, useStateSpy, createProduct;
      let store = mockStore(state);
      beforeEach(() => {
         useState = jest.fn()
         useStateSpy = jest.spyOn(React, 'useState');
         useStateSpy.mockImplementation((initialState) => [
            initialState,
            useState
         ]);

         createProduct = mount(
            <Provider store={store}>
               <CreateProduct />
            </Provider>,
         );
      });

      // Revisen bien que tipo de dato utilizamos en cada propiedad.
      it('Deberia inicializar de forma correcta los valores del', () => {
         expect(useStateSpy).toHaveBeenCalledWith({
            name: '',
            price: 0,
            description: '',
            stock: 0,
         });
      });

      describe('Name input', () => {
         it('Debe reconocer cuando hay un cambio en el valor del input "name"', () => {
            createProduct.find('input[name="name"]').simulate('change', {
               target: { name: 'name', value: 'Barbijo Henry' },
            });
            expect(useState).toHaveBeenCalledWith({
               name: 'Barbijo Henry',
               price: 0,
               description: '',
               stock: 0,
            });

            createProduct.find('input[name="name"]')
            .simulate('change', {
               target: { name: 'name', value: 'Mouse Inalambrico Henry' },
            });
            expect(useState).toHaveBeenCalledWith({
               name: 'Mouse Inalambrico Henry',
               price: 0,
               description: '',
               stock: 0,
            });
         });
      });

      describe('Price input', () => {
         it('Debe reconocer cuando hay un cambio en el valor del input "price"', () => {
            createProduct.find('input[name="price"]')
           .simulate('change', {
               target: { name: 'price', value: 100 },
            });
            expect(useState).toHaveBeenCalledWith({
               name: '',
               price: 100,
               description: '',
               stock: 0,
            });

            createProduct.find('input[name="price"]')
            .simulate('change', {
               target: { name: 'price', value: 200 },
            });
            expect(useState).toHaveBeenCalledWith({
               name: '',
               price: 200,
               description: '',
               stock: 0,
            });
         });
      });

      describe('Description input', () => {
         it('Debe reconocer cuando hay un cambio en el valor del input "description"', () => {
             createProduct.find(
               'textarea[name="description"]',
            )
            .simulate('change', {
               target: { name: 'description', value: 'Descripcion' },
            });
            expect(useState).toHaveBeenCalledWith({
               name: '',
               price: 0,
               description: 'Descripcion',
               stock: 0,
            });

            createProduct.find(
               'textarea[name="description"]',
            )
            .simulate('change', {
               target: { name: 'description', value: 'Descripcion 2' },
            });
            expect(useState).toHaveBeenCalledWith({
               name: '',
               price: 0,
               description: 'Descripcion 2',
               stock: 0,
            });
         });
      });

      describe('Stock input', () => {
         it('Debe reconocer cuando hay un cambio en el valor del input "stock"', () => {
            createProduct.find('input[name="stock"]')
            .simulate('change', {
               target: { name: 'stock', value: 5 },
            });
            expect(useState).toHaveBeenCalledWith({
               name: '',
               price: 0,
               description: '',
               stock: 5,
            });

            createProduct.find('input[name="stock"]')
            .simulate('change', {
               target: { name: 'stock', value: 10 },
            });
            expect(useState).toHaveBeenCalledWith({
               name: '',
               price: 0,
               description: '',
               stock: 10,
            });
         });
      });
   });

   describe('Dispatch al store', () => {
      let createProduct, useState, useStateSpy;
      let store = mockStore(state);

      beforeEach(() => {
         useState = jest.fn();
         useStateSpy = jest.spyOn(React, 'useState');
         useStateSpy.mockImplementation((initialState) => [
            initialState,
            useState,
         ]);
         store = mockStore(state, actions.createProductAction);
         store.clearActions();
         createProduct = mount(
            <Provider store={store}>
               <MemoryRouter initialEntries={['/products/create']}>
                  <CreateProduct />
               </MemoryRouter>
            </Provider>,
         );
      });

      afterEach(() => jest.restoreAllMocks());

      it('Debe disparar la acción createProduct con los datos del state cuando se haga submit del form.', () => {
         const createProductFn = jest.spyOn(actions, 'createProduct');
         createProduct.find('form').simulate('submit');
         expect(store.getActions()).toEqual([
            {
               type: CREATE_PRODUCT,
               payload: {
                  name: '',
                  price: 0,
                  description: '',
                  stock: 0,
                  id:6,
               },
            },
         ]);
         expect(CreateProduct.toString().includes('useDispatch')).toBe(true);
         expect(createProductFn).toHaveBeenCalled();
      });

      it('Debe evitar que se refresque la página luego de hacer submit con el uso del evento "preventDefault"', () => {
         const event = { preventDefault: () => {} };
         jest.spyOn(event, 'preventDefault');
         createProduct.find('form').simulate('submit', event);
         expect(event.preventDefault).toBeCalled();
      });
   });
});
