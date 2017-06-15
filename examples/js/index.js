import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const render = (Component) => {
  ReactDOM.render(
    <div>
      <Component />
    </div>,
    document.querySelector('#root'),
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./app', () => { render(App); });
}
