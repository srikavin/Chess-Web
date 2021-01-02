import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {store} from './app/store';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
                <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

if (process.env.NODE_ENV === 'production') {
    serviceWorker.register();
} else {
    serviceWorker.unregister();
}
