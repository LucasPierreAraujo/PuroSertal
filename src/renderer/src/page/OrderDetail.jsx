import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const availableItems = [
  { name: 'Coca Cola Lata', price: 6 },
  { name: 'Panelada Pequena', price: 32 },
  { name: 'Pizza Grande', price: 45 },
];

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

  const suggestionsRef = useRef(null); // Ref para o contêiner das sugestões

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
    } else {
      alert('Comanda não encontrada!');
      navigate('/orders');
    }
  }, [orderId, navigate, loadOrderFromLocalStorage]);

  // Função para ocultar sugestões quando clicado fora
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
    const payment = parseFloat(paymentValue);
    if (!validatePayment(payment)) return;

    const updatedOrder = {
      ...order,
      totalPaid: order.totalPaid + payment,
      paymentMethod,
      isClosed: order.totalPaid + payment >= order.total,
    };

    updateOrderInLocalStorage(updatedOrder);
    setOrder(updatedOrder);
    setPaymentValue('');
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
    setItemInput(item.name); // Define o nome do item no campo de entrada
    setItemQuantity(1); // Reseta a quantidade para 1 ao selecionar um item
    setSuggestedItems([]); // Limpa as sugestões
  };

  if (!order) return <div>Carregando...</div>;

  const totalDue = order.total - order.totalPaid;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => navigate('/orders')} className="mb-4 p-2 bg-gray-300 rounded hover:bg-gray-400">
        Voltar para Comandas
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {order.name} {order.isClosed && '(Comanda Fechada)'}
      </h1>
      <ul className="mb-4">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between items-center text-gray-700 mb-2">
            <span>
              {item.name} - R$ {item.price.toFixed(2)} x {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
            </span>
            <div className="flex items-center">
              <input
                type="number"
                value={removeQuantity}
                onChange={(e) => setRemoveQuantity(e.target.value)}
                placeholder="Qtd"
                min="1"
                className="w-16 p-1 border border-gray-300 rounded text-center mr-2"
              />
              <button 
                onClick={() => removeItem(item)} 
                className="ml-2 p-1 text-red-500 hover:text-red-600"
              >
                <FaTrash size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-lg font-bold text-gray-800">Total: R$ {order.total.toFixed(2)}</p>
      <p className="text-lg font-bold text-gray-800">Total Pago: R$ {order.totalPaid.toFixed(2)}</p>
      <p className="text-lg font-bold text-gray-800">Falta Pagar: R$ {totalDue.toFixed(2)}</p>
      <div className="mt-4">
        <input
          type="text"
          value={itemInput}
          onChange={handleItemInputChange}
          placeholder="Digite o nome do item"
          className="p-1 border border-gray-300 rounded mr-2"
        />
        {suggestedItems.length > 0 && (
          <ul ref={suggestionsRef} className="absolute bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto w-48 z-10">
            {suggestedItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleItemSelect(item)}
                className="p-1 hover:bg-gray-200 cursor-pointer"
                onMouseEnter={(e) => e.currentTarget.classList.add('bg-gray-200')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('bg-gray-200')}
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
        <input
          type="number"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
          placeholder="Qtd"
          min="1"
          className="w-16 p-1 border border-gray-300 rounded mr-2"
        />
        <button 
          onClick={addItem} 
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar Item
        </button>
      </div>
      <div className="mt-4">
        <input
          type="number"
          value={paymentValue}
          onChange={(e) => setPaymentValue(e.target.value)}
          placeholder="Valor do Pagamento"
          className="p-1 border border-gray-300 rounded mr-2"
        />
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="p-1 border border-gray-300 rounded mr-2"
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
          <option value="Débito">Débito</option>
          <option value="Crédito">Crédito</option>
          <option value="Fiado">Fiado</option>
        </select>
        <button 
          onClick={handlePayment} 
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Finalizar Pagamento
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
