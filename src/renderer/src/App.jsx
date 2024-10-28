import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './page/Home';
import Products from './page/Products';
import Orders from './page/Orders';
import OrderDetail from './page/OrderDetail';
import Reports from './page/Reports';
import StockControl from './page/StockControl';
import Clients from './page/Clients';
import NotFound from './page/NotFound';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/stock" element={<StockControl />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
