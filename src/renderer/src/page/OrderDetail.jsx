import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [paymentValue, setPaymentValue] = useState('');
  const [itemInput, setItemInput] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [removeQuantity, setRemoveQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [orderDateTime, setOrderDateTime] = useState(''); // Novo estado para armazenar a data e hora

  const suggestionsRef = useRef(null);

  const loadProductsFromLocalStorage = useCallback(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  }, []);

  const loadClientsFromLocalStorage = useCallback(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  }, []);

  const loadOrderFromLocalStorage = useCallback((id) => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      return orders.find(order => order.id === parseInt(id, 10));
    }
    return null;
  }, []);

  useEffect(() => {
    const loadedOrder = loadOrderFromLocalStorage(orderId);
    if (loadedOrder) {
      setOrder(loadedOrder);
      setOrderDateTime(new Date(loadedOrder.createdAt).toLocaleString()); // Definindo a data e hora da comanda
    } else {
      alert('Comanda não encontrada!');
      navigate('/orders');
    }

    const products = loadProductsFromLocalStorage();
    setAvailableItems(products);

    const clients = loadClientsFromLocalStorage();
    setClients(clients);
  }, [orderId, navigate, loadOrderFromLocalStorage, loadProductsFromLocalStorage, loadClientsFromLocalStorage]);

  const handleClickOutside = (event) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
      setSuggestedItems([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validatePayment = (payment) => {
    if (isNaN(payment) || payment <= 0) {
      alert('Por favor, insira um valor de pagamento válido.');
      return false;
    }
    if (payment + order.totalPaid > order.total) {
      alert('O valor pago não pode exceder o total da comanda.');
      return false;
    }
    return true;
  };

  const handlePayment = () => {
    if (paymentMethod === 'Fiado' && selectedClient) {
      const updatedClient = { ...selectedClient };
      updatedClient.orders = [...(updatedClient.orders || []), { ...order, items: order.items }];

      const allClients = loadClientsFromLocalStorage();
      const updatedClients = allClients.map(client => (client.id === updatedClient.id ? updatedClient : client));
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      
      alert('Comanda salva no perfil do cliente com sucesso!');

      const updatedOrder = { ...order, isClosed: true };
      updateOrderInLocalStorage(updatedOrder);
      setOrder(updatedOrder);
      navigate('/clients');
      return;
    }

    const payment = parseFloat(paymentValue);
    if (!validatePayment(payment)) return;

    const updatedOrder = {
      ...order,
      totalPaid: order.totalPaid + payment,
      paymentMethod,
      isClosed: order.totalPaid + payment >= order.total,
    };

    if (paymentMethod === 'Fiado' && selectedClient) {
      updatedOrder.clientId = selectedClient.id;
    }

    updateOrderInLocalStorage(updatedOrder);
    setOrder(updatedOrder);
    setPaymentValue('');
    setSelectedClient(null);
  };

  const updateOrderInLocalStorage = (updatedOrder) => {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    const updatedOrders = savedOrders.map(o => (o.id === order.id ? updatedOrder : o));
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const addItem = () => {
    const item = availableItems.find(i => i.name.toLowerCase() === itemInput.toLowerCase());
    const quantity = parseInt(itemQuantity);

    if (!item || isNaN(quantity) || quantity <= 0) {
      alert('Por favor, selecione um item válido e insira uma quantidade válida.');
      return;
    }

    const existingItemIndex = order.items.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase());
    let updatedOrder;

    if (existingItemIndex !== -1) {
      const existingItem = order.items[existingItemIndex];
      existingItem.quantity += quantity;
      updatedOrder = {
        ...order,
        items: [...order.items],
        total: order.total + (item.price * quantity),
      };
      updatedOrder.items[existingItemIndex] = existingItem;
    } else {
      const newItem = { name: item.name, price: item.price, quantity };
      updatedOrder = {
        ...order,
        items: [...order.items, newItem],
        total: order.total + (item.price * quantity),
      };
    }

    updateOrderInLocalStorage(updatedOrder);
    setOrder(updatedOrder);
    setItemInput('');
    setItemQuantity(1);
  };

  const removeItem = (itemToRemove) => {
    const quantityToRemove = parseInt(removeQuantity);
    if (isNaN(quantityToRemove) || quantityToRemove <= 0) {
      alert('Por favor, insira uma quantidade válida para remover.');
      return;
    }

    if (quantityToRemove > itemToRemove.quantity) {
      alert('A quantidade a ser removida não pode exceder a quantidade atual do item.');
      return;
    }

    const updatedItems = order.items.filter(item => item.name !== itemToRemove.name);
    const remainingQuantity = itemToRemove.quantity - quantityToRemove;
    const updatedTotal = order.total - (itemToRemove.price * quantityToRemove);

    let updatedOrder = {
      ...order,
      items: remainingQuantity > 0 
        ? [...updatedItems, { ...itemToRemove, quantity: remainingQuantity }] 
        : updatedItems,
      total: Math.max(updatedTotal, 0),
    };

    updateOrderInLocalStorage(updatedOrder);
    setOrder(updatedOrder);
    alert(`${quantityToRemove} x ${itemToRemove.name} removido(s) com sucesso!`);
  };

  const handleItemInputChange = (e) => {
    const value = e.target.value;
    setItemInput(value);

    const suggestions = availableItems.filter(item => 
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestedItems(suggestions);
  };

  const handleItemSelect = (item) => {
    setItemInput(item.name);
    setItemQuantity(1);
    setSuggestedItems([]);
  };

  if (!order) return <div className="text-center text-gray-500">Carregando...</div>;

  const totalDue = order.total - order.totalPaid;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate('/orders')} className="mb-4 p-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 shadow-md">
        Voltar para Comandas
      </button>
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">
        {order.name} {order.isClosed && <span className="text-sm font-normal text-gray-500">(Comanda Fechada)</span>}
      </h1>
      <p className="text-gray-600">Data e Hora de Abertura: {orderDateTime}</p> {/* Exibindo a data e hora */}
      <ul className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <span className="text-gray-800 font-medium">
              {item.name} - R$ {item.price.toFixed(2)} x {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={removeQuantity}
                onChange={(e) => setRemoveQuantity(e.target.value)}
                min="1"
                className="w-16 border border-gray-300 rounded p-1"
                placeholder="Qtd."
              />
              <button onClick={() => removeItem(item)} className="p-1 text-red-600 hover:text-red-800">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mb-4">
        <input
          type="text"
          value={itemInput}
          onChange={handleItemInputChange}
          placeholder="Nome do item"
          className="border border-gray-300 rounded p-2 w-full"
        />
        {suggestedItems.length > 0 && (
          <ul ref={suggestionsRef} className="border border-gray-300 rounded bg-white">
            {suggestedItems.map((item, index) => (
              <li key={index} onClick={() => handleItemSelect(item)} className="p-2 hover:bg-gray-200 cursor-pointer">
                {item.name} - R$ {item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex space-x-4 mb-4">
        <input
          type="number"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
          min="1"
          className="border border-gray-300 rounded p-2 w-16"
          placeholder="Qtd."
        />
        <button onClick={addItem} className="p-2 text-white bg-green-600 rounded hover:bg-green-700">
          Adicionar Item
        </button>
      </div>
      <div className="mb-4">
        <h2 className="font-medium text-gray-700">Método de Pagamento:</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
          <option value="Débito">Débito</option>
          <option value="Crédito">Crédito</option>
          <option value="Fiado">Fiado</option>
        </select>
      </div>
      {paymentMethod === 'Fiado' && (
        <div className="mb-4">
          <h2 className="font-medium text-gray-700">Selecionar Cliente:</h2>
          <select
            value={selectedClient ? selectedClient.id : ''}
            onChange={(e) => setSelectedClient(clients.find(client => client.id === parseInt(e.target.value)))}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="">Selecione um cliente</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          value={paymentValue}
          onChange={(e) => setPaymentValue(e.target.value)}
          placeholder="Valor do Pagamento"
          className="border border-gray-300 rounded p-2 w-32"
        />
        <button onClick={handlePayment} className="p-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          Pagar
        </button>
      </div>
      <h2 className="text-lg font-semibold text-gray-800">Total: R$ {order.total.toFixed(2)}</h2>
      <h3 className="text-lg font-semibold text-gray-800">Total Pago: R$ {order.totalPaid.toFixed(2)}</h3>
      <h3 className="text-lg font-semibold text-gray-800">Devido: R$ {totalDue.toFixed(2)}</h3>
    </div>
  );
};

export default OrderDetail;
