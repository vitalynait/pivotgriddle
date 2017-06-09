// import 'babel-core/register';
// import 'babel-polyfill';
// import 'isomorphic-fetch';
// import { AppContainer } from 'react-hot-loader';
// import App from './app';

// const render = Component => {
//   ReactDOM.render(
//     <AppContainer>
//       <Component />
//     </AppContainer>,
//     document.getElementById('root')
//   )
// }

// render(App)

// if (module.hot) {
//   module.hot.accept('./app', () => { render(App) })
// }

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';


const render = Component => {
  ReactDOM.render(
    <div>
      <Component />
    </div>,
    document.getElementById('root')
  )
}
render(App);
if (module.hot) {
  module.hot.accept('./app', () => { render(App) })
}
