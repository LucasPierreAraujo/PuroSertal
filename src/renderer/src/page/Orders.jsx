import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newOrderName, setNewOrderName] = useState(''); // State for new order name
  const [paymentReport, setPaymentReport] = useState([]); // State for payment report

  const loadOrdersFromLocalStorage = () => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  };

  const loadPaymentReportFromLocalStorage = () => {
    const savedReport = localStorage.getItem('paymentReport');
    return savedReport ? JSON.parse(savedReport) : [];
  };

  useEffect(() => {
    const loadedOrders = loadOrdersFromLocalStorage();
    setOrders(loadedOrders);
    setPaymentReport(loadPaymentReportFromLocalStorage()); // Load payment report on mount
  }, []);

  const createNewOrder = () => {
    if (!newOrderName.trim()) {
      alert('Por favor, insira um nome para a comanda.');
      return;
    }

    const newOrder = {
      id: Date.now(), // Using timestamp for unique ID
      name: newOrderName.trim(),
      items: [],
      total: 0,
      totalPaid: 0,
      isClosed: false,
      payments: [],
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setNewOrderName('');
    navigate(`/order/${newOrder.id}`); // Correctly formatted string
  };

  const saveDeletedOrderToReport = (order) => {
    if (order.totalPaid > 0) {
      const existingReport = loadPaymentReportFromLocalStorage();
      const updatedReport = [
        ...existingReport,
        { name: order.name, totalPaid: order.totalPaid, payments: order.payments },
      ];
      localStorage.setItem('paymentReport', JSON.stringify(updatedReport));
    }
  };

  const handleDeleteOrder = (orderId) => {
    const orderToDelete = orders.find(order => order.id === orderId);
    if (orderToDelete) {
      // Verifica se a comanda está fechada antes de perguntar para excluir
      if (!orderToDelete.isClosed) {
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir a comanda "${orderToDelete.name}"?`);
        if (!confirmDelete) return; // Sai se o usuário cancelar
      }

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
              <h2 className="text-xl font-bold text-gray-600">{order.name}</h2>
              <p className="text-gray-700">
                Total a Pagar: R$ {(order.total - order.totalPaid).toFixed(2)}
              </p>
              <p className={`font-bold ${order.isClosed ? 'text-green-600' : 'text-red-600'}`}>
                {order.isClosed ? 'Comanda Fechada' : 'Comanda Aberta'}
              </p>
            </Link>
            <button onClick={() => handleDeleteOrder(order.id)} className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600">
              Excluir Comanda
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Relatório de Pagamentos</h2>
        <ul>
          {paymentReport.length > 0 ? (
            paymentReport.map((entry, index) => (
              <li key={index} className="text-gray-700">
                {entry.name} - Total Pago: R$ {entry.totalPaid.toFixed(2)}
                <ul className="ml-4">
                  {entry.payments.map((payment, paymentIndex) => (
                    <li key={paymentIndex} className="text-gray-600">
                      {payment.method}: R$ {payment.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <li className="text-gray-600">Nenhum pagamento realizado ainda.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Orders;
