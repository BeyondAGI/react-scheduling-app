import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'primeflex/primeflex.min.css';
import App from './App';
import "primereact/resources/themes/md-dark-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);