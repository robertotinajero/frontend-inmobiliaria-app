import ReactDOM from 'react-dom/client'
import App from './App'
import "./index.css";
import "./colors.css";
import AppRoutes from './AppRoutes';

import { AuthProvider } from './context/AuthContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
