import React from 'react';
import { mount, configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import isReact from 'is-react';

import HomeConnected, {
   Home,
   mapDispatchToProps,
   mapStateToProps,
} from '../src/components/Home/Home';
import ProductCard from '../src/components/ProductCard/ProductCard';
import mainImage from '../src/img-cp2/main-image-cp2.jpg';
import * as actions from '../src/redux/actions';
import * as data from '../db.json';
import axios from 'axios';
import nock from 'nock';
import nodeFetch from 'node-fetch'
axios.defaults.adapter = require('axios/lib/adapters/http');

configure({ adapter: new Adapter() });

describe('<Home />', () => {
   let home, store, state, getAllProductsSpy, componentDidMountSpy;
   global.fetch = nodeFetch
   const mockStore = configureStore([thunk]);
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
      state = {
         products: [],
         productDetails: {},
      };
      store = mockStore(state);
      home = mount(<HomeConnected store={store} />);
      // Si o si vas a tener que usar class component! No van a pasar ninguno de los tests si no lo haces.
      expect(isReact.classComponent(Home)).toBeTruthy();

      store.clearActions();

   });

 
   afterEach(() => {
     nock.cleanAll();
   });

   it('Debería renderizar un div contenedor', () => {
      expect(home.find('div')).toHaveLength(1);
   });

   it('Debería rederizar un "h1" con el texto "Henry Commerce"', () => {
      expect(home.find('h1').at(0).text()).toEqual('Henry Commerce');
   });

   it('Debería renderizar en un tag "img" la imagen provista en la carpeta "img-cp2"', () => {
      // Tendrías que importar la img a tu archivo "Home.jsx" y luego usarla como source de img.
      // Podés ver como lo hacemos en este mismo archivo en la linea 16!
      expect(home.find('img').at(0).prop('src')).toEqual(mainImage);
   });

   it('La imagen debería tener un atributo "alt" con el texto "main-img"', () => {
      expect(home.find('img').at(0).prop('alt')).toEqual('main-img');
   });

   it('Debería rederizar un "h3" con el texto "Products"', () => {
      expect(home.find('h3').at(0).text()).toEqual('Products');
   });

   describe('connect Redux', () => {
      it('Debería traer de redux nuestros products usando mapStateToProps', () => {
         // El estado debería tener un nombre "products".
         expect(mapStateToProps(state)).toEqual({ products: state.products });
      });

      if (typeof mapDispatchToProps === 'function') {
         // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UNA FUNCIÓN.
         it('Debería traer por props la funcion getAllProducts de Redux usando mapDispatchToProps', () => {
            // Acá testeamos que hagas todo el proceso. Utilizas la funcion "mapDispatchToProps",
            // y con ella despachas la accion "getAllProducts".
            const getAllProducts = jest.spyOn(actions, 'getAllProducts');
            const dispatch = jest.fn();
            const props = mapDispatchToProps(dispatch);
            props.getAllProducts();
            expect(dispatch).toHaveBeenCalled();
            expect(getAllProducts).toHaveBeenCalled();
         });
      } else {
         // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UN OBJETO.
         it('Debería traer por props la action creator getAllProducts de Redux usando mapDispatchToProps', () => {
            // Acá testeamos que hagas todo el proceso. Utilizas connect y el objeto "mapDispatchToProps",
            // traes la acción "getAllProducts". Con esto podrás usarla luego en el componente.
            const getAllProducts = jest.spyOn(actions, 'getAllProducts');
            getAllProducts();
            expect(
               mapDispatchToProps.hasOwnProperty('getAllProducts'),
            ).toBeTruthy();
            expect(getAllProducts).toHaveBeenCalled();
         });
      }
   });

   describe('React LifeCycles', () => {
      getAllProductsSpy = jest.fn();
      let instance;
      beforeEach(async () => {
         state = {
            products: data.products,
            productDetails: {},
         };
         store = mockStore(state);
         home = mount(
            <Provider store={store}>
               <MemoryRouter initialEntries={['/home']}>
                  <HomeConnected />
               </MemoryRouter>
            </Provider>,
         );
      });

      beforeAll(() => {
         // Ojo acá. Antes que corran los demás tests, chequeamos que estés usando el lifeCycle correspondiente ( componentDidMount )
         // y que en él ejecutas la action creator "getAllProducts" para traerte toda esa data.
         // Si no pasan estos tests, no pasan los demás!
         componentDidMountSpy = jest.spyOn(Home.prototype, 'componentDidMount');
         instance = shallow(
            <Home getAllProducts={getAllProductsSpy} />,
         ).instance();

         instance.componentDidMount();
         expect(componentDidMountSpy).toHaveBeenCalled();
         expect(getAllProductsSpy).toHaveBeenCalled();
      });

      it('Debería mapear la cantidad de products que hayan en el store y renderizar una <ProductCard /> por cada una', () => {
         // Cuidado acá. Como realizamos una petición al back (código asincrónico), el componente se va a
         // renderizar más rápido. Hay un problema con esto, se va a intentar renderizar algunos datos que
         // no existen todavía, lo que es igual a un fatal error. Deberías asegurarte que existen
         // products y luego renderizarlas!
         // Pista: Usa un renderizado condicional.
         // IMPORTANTE: revisar el código arriba de este test, el beforeAll.
         // Ahí se está testeando el uso del lifecycle componentDidMount y que en él
         // traigas la data a renderizar.
         expect(home.find(ProductCard)).toHaveLength(5);
      });

      it('Debería pasar como props a cada componente <ProductCard /> las propiedades id, name, price , stock de cada product', () => {
         // No olviden pasar la props KEY en el mapeo para mantener buenas practicas.
         expect(home.find(ProductCard).at(0).props().id).toEqual(1);
         expect(home.find(ProductCard).at(0).props().price).toEqual(120);
         expect(home.find(ProductCard).at(0).props().name).toEqual('Remera Henry');
         expect(home.find(ProductCard).at(0).props().stock).toEqual(10);

         expect(home.find(ProductCard).at(1).props().id).toEqual(2);
         expect(home.find(ProductCard).at(1).props().price).toEqual(60);
         expect(home.find(ProductCard).at(1).props().name).toEqual('Lapicera Henry');
         expect(home.find(ProductCard).at(1).props().stock).toEqual(50);

         expect(home.find(ProductCard).at(2).props().id).toEqual(3);
         expect(home.find(ProductCard).at(2).props().price).toEqual(100);
         expect(home.find(ProductCard).at(2).props().name).toEqual('Agenda Henry');
         expect(home.find(ProductCard).at(2).props().stock).toEqual(5);

         expect(home.find(ProductCard).at(3).props().id).toEqual(4);
         expect(home.find(ProductCard).at(3).props().price).toEqual(110);
         expect(home.find(ProductCard).at(3).props().name).toEqual('Zapatillas Henry');
         expect(home.find(ProductCard).at(3).props().stock).toEqual(8);

         expect(home.find(ProductCard).at(4).props().id).toEqual(5);
         expect(home.find(ProductCard).at(4).props().price).toEqual(200);
         expect(home.find(ProductCard).at(4).props().name).toEqual('Pantalones Henry');
         expect(home.find(ProductCard).at(4).props().stock).toEqual(3);
      });
   });
});
