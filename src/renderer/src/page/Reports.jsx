import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa'; // Importando ícone de lixeira

const Relatorios = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [tipoRelatorio, setTipoRelatorio] = useState('produtos'); // produtos, vendas, clientes, etc.
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    // Carregar relatórios do localStorage
    const savedRelatorios = JSON.parse(localStorage.getItem('relatorios')) || [];
    setRelatorios(savedRelatorios);
  }, []);

  const adicionarRelatorio = (e) => {
    e.preventDefault();
    const novoRelatorio = {
      id: relatorios.length ? relatorios[relatorios.length - 1].id + 1 : 1,
      tipo: tipoRelatorio,
      data: new Date().toISOString(),
    };

    const updatedRelatorios = [...relatorios, novoRelatorio];
    setRelatorios(updatedRelatorios);
    localStorage.setItem('relatorios', JSON.stringify(updatedRelatorios));
    setFeedbackMessage('Relatório adicionado com sucesso!');
  };

  const handleTipoRelatorioChange = (e) => {
    setTipoRelatorio(e.target.value);
  };

  const handleDeleteRelatorio = (id) => {
    const updatedRelatorios = relatorios.filter(relatorio => relatorio.id !== id);
    setRelatorios(updatedRelatorios);
    localStorage.setItem('relatorios', JSON.stringify(updatedRelatorios));
    setFeedbackMessage('Relatório excluído com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatórios</h1>
      {feedbackMessage && <div className="mb-4 text-green-600">{feedbackMessage}</div>}
      
      <form onSubmit={adicionarRelatorio} className="mb-6">
        <select value={tipoRelatorio} onChange={handleTipoRelatorioChange} className="p-2 border border-gray-300 rounded mr-2">
          <option value="produtos">Relatório de Produtos</option>
          <option value="vendas">Relatório de Vendas</option>
          <option value="clientes">Relatório de Clientes</option>
          {/* Adicione mais tipos conforme necessário */}
        </select>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Adicionar Relatório
        </button>
      </form>

      <table className="min-w-full bg-white shadow-md rounded mb-8">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Tipo</th>
            <th className="py-2 px-4">Data</th>
            <th className="py-2 px-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {relatorios.length > 0 ? (
            relatorios.map((relatorio) => (
              <tr key={relatorio.id}>
                <td className="border-t py-2 px-4">{relatorio.id}</td>
                <td className="border-t py-2 px-4">{relatorio.tipo}</td>
                <td className="border-t py-2 px-4">{new Date(relatorio.data).toLocaleString()}</td>
                <td className="border-t py-2 px-4 text-center">
                  <button onClick={() => handleDeleteRelatorio(relatorio.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border-t py-2 px-4 text-center">Nenhum relatório encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Relatorios;
