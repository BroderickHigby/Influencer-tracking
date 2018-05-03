import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

import {StripeProvider} from 'react-stripe-elements';

ReactDOM.render(
  <BrowserRouter>
    <StripeProvider apiKey="pk_live_AEuriPJROzqDhDu5Y73oTUR4">
      <App />
    </StripeProvider>
  </BrowserRouter>
  , document.getElementById('root'));
registerServiceWorker();
