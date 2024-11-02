import './assets/main.css'; // Mova o CSS para cá
import { HashRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import AppRoutes from './routs/AppRoutes';

const App = () => {
  return (
    <Router>
      <Header />
      <AppRoutes />
    </Router>
  );
};

export default App;
