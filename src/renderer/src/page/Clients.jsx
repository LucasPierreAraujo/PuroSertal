import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importando ícones para editar e excluir
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [editingClientId, setEditingClientId] = useState(null);
  const navigate = useNavigate(); // Adicionando useNavigate

  useEffect(() => {
    const savedClients = JSON.parse(localStorage.getItem('clients')) || [];
    setClients(savedClients);
  }, []);

  const addClient = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      setFeedbackMessage('Por favor, preencha todos os campos.');
      return;
    }

    const newClient = {
      id: clients.length ? clients[clients.length - 1].id + 1 : 1,
      name: clientName,
      phone: clientPhone,
    };

    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setFeedbackMessage('Cliente adicionado com sucesso!');
    setClientName('');
    setClientPhone('');
  };

  const deleteClient = (id) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setFeedbackMessage('Cliente excluído com sucesso!');
  };

  const startEditing = (client) => {
    setEditingClientId(client.id);
    setClientName(client.name);
    setClientPhone(client.phone);
  };

  const saveClient = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      setFeedbackMessage('Por favor, preencha todos os campos.');
      return;
    }

    const updatedClients = clients.map(client => 
      client.id === editingClientId ? { ...client, name: clientName, phone: clientPhone } : client
    );

    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    setFeedbackMessage('Cliente atualizado com sucesso!');
    setEditingClientId(null);
    setClientName('');
    setClientPhone('');
  };

  const navigateToDetails = (clientId) => {
    navigate(`/client/${clientId}`); // Redireciona para a página de detalhes do cliente
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Clientes</h1>
      {feedbackMessage && <div className="mb-4 text-green-600">{feedbackMessage}</div>}
      
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4"
      />

      <form onSubmit={editingClientId ? saveClient : addClient} className="mb-6">
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nome do Cliente"
          className="p-2 border border-gray-300 rounded mr-2"
          required
        />
        <input
          type="text"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="Telefone do Cliente"
          className="p-2 border border-gray-300 rounded mr-2"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingClientId ? 'Salvar Cliente' : 'Adicionar Cliente'}
        </button>
      </form>

      <table className="min-w-full bg-white shadow-md rounded mb-8">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nome</th>
            <th className="py-2 px-4">Telefone</th>
            <th className="py-2 px-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
            clients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
              <tr key={client.id}>
                <td className="border-t py-2 px-4">{client.id}</td>
                <td className="border-t py-2 px-4 cursor-pointer" onClick={() => navigateToDetails(client.id)}>
                  {client.name}
                </td>
                <td className="border-t py-2 px-4">{client.phone}</td>
                <td className="border-t py-2 px-4 text-center">
                  <button onClick={() => deleteClient(client.id)} className="text-red-600 hover:text-red-800 mr-2">
                    <FaTrash />
                  </button>
                  <button onClick={() => startEditing(client)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <FaEdit />
                  </button>
                  {/* O botão "Visualizar Comandas" foi removido */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border-t py-2 px-4 text-center">Nenhum cliente encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;
