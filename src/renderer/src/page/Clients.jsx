import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importando ícones de edição e lixeira

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', phone: '' });
  const [editingClient, setEditingClient] = useState(null);
  const [orderToAdd, setOrderToAdd] = useState('');

  // Carregar clientes do localStorage ao montar o componente
  useEffect(() => {
    const savedClients = JSON.parse(localStorage.getItem('clients'));
    if (savedClients) {
      setClients(savedClients);
    } else {
      // Adicionando alguns exemplos de clientes
      const initialClients = [
        { id: 1, name: 'João Silva', phone: '1234-5678', orders: ['Comanda 1'] },
        { id: 2, name: 'Maria Souza', phone: '9876-5432', orders: [] },
        { id: 3, name: 'Carlos Almeida', phone: '4567-8901', orders: ['Comanda 2', 'Comanda 3'] },
      ];
      setClients(initialClients);
      localStorage.setItem('clients', JSON.stringify(initialClients)); // Salvar exemplos no localStorage
    }
  }, []);

  // Atualizar o localStorage sempre que a lista de clientes mudar
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const handleDelete = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddClient = () => {
    const newId = clients.length ? clients[clients.length - 1].id + 1 : 1;
    setClients([...clients, { ...newClient, id: newId, orders: [] }]);
    setNewClient({ name: '', phone: '' });
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient({ name: client.name, phone: client.phone });
  };

  const handleUpdateClient = () => {
    setClients(clients.map(client => 
      client.id === editingClient.id ? { ...client, name: newClient.name, phone: newClient.phone } : client
    ));
    setEditingClient(null);
    setNewClient({ name: '', phone: '' });
  };

  const handleAddOrder = (clientId) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        return { ...client, orders: [...client.orders, orderToAdd] };
      }
      return client;
    });
    setClients(updatedClients);
    setOrderToAdd('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-primary mb-4">Gestão de Clientes</h1>

      {/* Formulário para adicionar/editar cliente */}
      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={newClient.name}
          onChange={handleChange}
          className="mr-2 p-2 border"
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefone"
          value={newClient.phone}
          onChange={handleChange}
          className="mr-2 p-2 border"
        />
        {editingClient ? (
          <button onClick={handleUpdateClient} className="p-2 bg-green-500 text-white rounded hover:bg-green-700">
            Atualizar Cliente
          </button>
        ) : (
          <button onClick={handleAddClient} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Adicionar Cliente
          </button>
        )}
      </div>

      {/* Tabela de clientes */}
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Telefone</th>
            <th className="px-4 py-2 text-center">Ações</th>
            <th className="px-4 py-2 text-center">Comandas</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-t">
              <td className="px-4 py-2">{client.name}</td>
              <td className="px-4 py-2">{client.phone}</td>
              <td className="px-4 py-2 text-center">
                <button className="mr-2 text-yellow-600 hover:text-yellow-800" onClick={() => handleEditClient(client)}>
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(client.id)}
                >
                  <FaTrash />
                </button>
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="text"
                  placeholder="Nova Comanda"
                  value={orderToAdd}
                  onChange={(e) => setOrderToAdd(e.target.value)}
                  className="mr-2 p-1 border"
                />
                <button onClick={() => handleAddOrder(client.id)} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-700">
                  Adicionar
                </button>
                <div>
                  {client.orders.length > 0 ? (
                    <ul>
                      {client.orders.map((order, index) => (
                        <li key={index}>{order}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>Nenhuma comanda vinculada</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;
