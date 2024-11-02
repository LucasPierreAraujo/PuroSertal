import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrderName, setNewOrderName] = useState('');

  const loadOrdersFromLocalStorage = () => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  };

  useEffect(() => {
    const loadedOrders = loadOrdersFromLocalStorage();
    setOrders(loadedOrders);
  }, []);

  const createNewOrder = () => {
    if (!newOrderName.trim()) {
      alert('Por favor, insira um nome para a comanda.');
      return;
    }

    const newOrder = {
      id: Date.now(),
      name: newOrderName.trim(),
      items: [],
      total: 0,
      totalPaid: 0,
      isClosed: false,
      payments: [],
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setNewOrderName('');
    navigate(`/order/${newOrder.id}`);
  };

  const saveDeletedOrderToReport = (order) => {
    if (order.totalPaid > 0) {
      const existingReports = JSON.parse(localStorage.getItem('reports')) || [];
      const report = {
        date: order.createdAt, // Você pode escolher como deseja lidar com a data
        amountPaid: order.totalPaid,
        paymentMethod: order.paymentMethod, // Supondo que você tenha esse campo
      };
      existingReports.push(report);
      localStorage.setItem('reports', JSON.stringify(existingReports));
    }
  };

  const handleDeleteOrder = (orderId) => {
    const orderToDelete = orders.find(order => order.id === orderId);
    if (orderToDelete) {
      if (!orderToDelete.isClosed) {
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir a comanda "${orderToDelete.name}"?`);
        if (!confirmDelete) return;
      }

      // Salvar o relatório antes de excluir a comanda
      saveDeletedOrderToReport(orderToDelete);
    }

    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Comandas</h1>

      <div className="mb-4">
        <input
          type="text"
          value={newOrderName}
          onChange={(e) => setNewOrderName(e.target.value)}
          placeholder="Nome da Nova Comanda"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button onClick={createNewOrder} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Criar Nova Comanda
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order.id} className={`p-4 shadow-lg rounded-lg bg-white cursor-pointer hover:bg-gray-100 ${order.isClosed ? 'border border-green-500' : 'border border-red-500'}`}>
            <Link to={`/order/${order.id}`} aria-label={`Detalhes da ${order.name}`}>
              <h2 className={`text-xl font-bold ${order.isClosed ? 'text-red-600' : 'text-green-600'}`}>{order.name}</h2>
              <p className="text-gray-700">
                Total a Pagar: R$ {(order.total - order.totalPaid).toFixed(2)}
              </p>
              <p className={`font-bold ${order.isClosed ? 'text-red-600' : 'text-green-600'}`}>
                {order.isClosed ? 'Comanda Fechada' : 'Comanda Aberta'}
              </p>
              <p className="text-gray-500">
                Salva em: {new Date(order.createdAt).toLocaleString()}
              </p>
            </Link>
            <button onClick={() => handleDeleteOrder(order.id)} className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600">
              Excluir Comanda
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
