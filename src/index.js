// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';


// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
// +import 'bootstrap/dist/css/bootstrap.min.css';
 import App from './App';
 import * as serviceWorker from './serviceWorker';
import client from './client/apollo';


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
 serviceWorker.unregister();
if (module.hot) module.hot.accept();
