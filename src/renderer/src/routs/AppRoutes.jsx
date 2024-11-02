// src/routes/AppRoutes.js
import { Route, Routes } from 'react-router-dom';
import Home from '../page/Home';
import Products from '../page/Products';
import Orders from '../page/Orders';
import OrderDetail from '../page/OrderDetail';
import Reports from '../page/Reports';
import StockControl from '../page/StockControl';
import Clients from '../page/Clients';
import ClientDetail from '../page/ClientDetail'; // Importando o novo componente
import NotFound from '../page/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/order/:orderId" element={<OrderDetail />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/stock" element={<StockControl />} />
    <Route path="/clients" element={<Clients />} />
    <Route path="/client/:clientId" element={<ClientDetail />} /> {/* Esta rota deve ser a última para não colidir com outras */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  );
};

export default AppRoutes;
