import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ClientDetail = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro'); // Método de pagamento padrão

  const loadClientsFromLocalStorage = () => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  };

  const updateClientInLocalStorage = (updatedClient) => {
    const clients = loadClientsFromLocalStorage();
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  useEffect(() => {
    const clients = loadClientsFromLocalStorage();
    const foundClient = clients.find(client => client.id === parseInt(clientId));
    if (foundClient) {
      setClient(foundClient);
    } else {
      alert('Cliente não encontrado!');
      navigate('/clients');
    }
  }, [clientId, navigate]);

  useEffect(() => {
    if (client) {
      updateClientInLocalStorage(client);
    }
  }, [client]);

  const handlePayment = (orderId) => {
    if (client) {
      const updatedOrders = client.orders.filter(order => order.id !== orderId);
      const updatedClient = { ...client, orders: updatedOrders };
      setClient(updatedClient);

      // Armazenar informações de pagamento no localStorage
      const pagamentos = JSON.parse(localStorage.getItem('pagamentos')) || [];
      const order = client.orders.find(o => o.id === orderId);
      const novoPagamento = {
        id: Date.now(), // Usar timestamp como ID único
        orderId,
        paymentMethod,
        value: order.total, // Valor total da comanda
        date: new Date().toISOString().split('T')[0], // Apenas a data
      };
      pagamentos.push(novoPagamento);
      localStorage.setItem('pagamentos', JSON.stringify(pagamentos));
    }
  };

  if (!client) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate('/clients')} className="mb-4 p-2 bg-gray-300 rounded hover:bg-gray-400">
        Voltar para Clientes
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{client.name}</h1>
      <p className="text-gray-700 mb-4">Telefone: {client.phone}</p>

      <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">Comandas Salvas</h2>
      {client.orders && client.orders.length > 0 ? (
        <ul className="list-disc pl-6">
          {client.orders.map((order) => (
            <li key={order.id} className="text-gray-700 mb-2">
              <div>
                {order.name} - Total: R$ {order.total.toFixed(2)} - Pago: R$ {order.totalPaid.toFixed(2)} - Salva em: {new Date(order.createdAt).toLocaleDateString()}
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="ml-2 border p-1">
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">Pix</option>
                  <option value="debito">Débito</option>
                  <option value="credito">Crédito</option>
                  <option value="fiado">Fiado</option>
                </select>
                <button
                  onClick={() => handlePayment(order.id)}
                  className="ml-4 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Pagar
                </button>
              </div>
              {order.items && order.items.length > 0 && (
                <ul className="list-disc pl-6 mt-1">
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600">
                      {item.name} - R$ {item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Nenhuma comanda salva.</p>
      )}
    </div>
  );
};

export default ClientDetail;
