

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import NewTask from './NewTask';

let persistor = persistStore(store);
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<App/>}/>
              <Route path="/newTask/:param?" element={<NewTask/>}/>
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();
