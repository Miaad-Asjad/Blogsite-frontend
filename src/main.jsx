
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/Store.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Provider store={store}>
    <App />
  </Provider>
);
