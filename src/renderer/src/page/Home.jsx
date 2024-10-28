import React, { useState, useEffect } from 'react';
import { FaCashRegister } from 'react-icons/fa'; // Importando o ícone
import jsPDF from 'jspdf';

const Home = () => {
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [openTime, setOpenTime] = useState(null);
  const [closeTime, setCloseTime] = useState(null);
  const [cashReport, setCashReport] = useState({
    cash: 0,
    creditCard: 0,
    debitCard: 0,
    pix: 0,
    totalOrders: 0,
  });
  const [showReport, setShowReport] = useState(false);

  // Carregar os dados do localStorage ao montar o componente
  useEffect(() => {
    const savedReport = JSON.parse(localStorage.getItem('cashReport'));
    if (savedReport) {
      setCashReport(savedReport);
    }
  }, []);

  const toggleCash = () => {
    if (isCashOpen) {
      handleCloseCash();
    } else {
      handleOpenCash();
    }
  };

  const handleOpenCash = () => {
    const now = new Date();
    setOpenTime(now);
    setIsCashOpen(true);
    setCashReport({
      cash: 0,
      creditCard: 0,
      debitCard: 0,
      pix: 0,
      totalOrders: 0,
    });
    alert('Caixa aberto!');
  };

  const handleCloseCash = () => {
    const now = new Date();
    setCloseTime(now);
    alert('Relatório gerado. Caixa fechado!');
    setIsCashOpen(false);
    setShowReport(true);
    generatePDF(now);

    // Salvar o relatório no localStorage
    localStorage.setItem('cashReport', JSON.stringify(cashReport));
  };

  const getTotal = () => {
    return (
      cashReport.cash +
      cashReport.creditCard +
      cashReport.debitCard +
      cashReport.pix
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const generatePDF = (closingTime) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Relatório do Dia', 20, 20);
    doc.setFontSize(12);
    doc.text(`Data: ${formatDate(openTime)}`, 20, 30);
    doc.text(`Horário de Abertura: ${openTime.toLocaleTimeString()}`, 20, 40);
    doc.text(`Horário de Fechamento: ${closingTime.toLocaleTimeString()}`, 20, 50);
    doc.text(`Total em Dinheiro: R$ ${cashReport.cash.toFixed(2)}`, 20, 60);
    doc.text(`Total em Cartão de Crédito: R$ ${cashReport.creditCard.toFixed(2)}`, 20, 70);
    doc.text(`Total em Cartão de Débito: R$ ${cashReport.debitCard.toFixed(2)}`, 20, 80);
    doc.text(`Total em Pix: R$ ${cashReport.pix.toFixed(2)}`, 20, 90);
    doc.text(`Total de Comandas: ${cashReport.totalOrders}`, 20, 100);
    doc.text(`Total Geral: R$ ${getTotal().toFixed(2)}`, 20, 110);
    doc.save('relatorio-caixa.pdf');
  };

  const addTransaction = (type, amount) => {
    if (!isCashOpen) {
      alert("O caixa está fechado. Não é possível adicionar transações.");
      return;
    }
    
    if (amount <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    setCashReport((prevReport) => ({
      ...prevReport,
      [type]: prevReport[type] + amount,
      totalOrders: prevReport.totalOrders + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Puro Sertão</h1>

      {/* Caixa de Resumo */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-xl font-bold text-gray-600">Total de Clientes</h2>
          <p className="text-3xl font-semibold text-gray-800">120</p>
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-xl font-bold text-gray-600">Total de Produtos</h2>
          <p className="text-3xl font-semibold text-gray-800">75</p>
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-xl font-bold text-gray-600">Total de Comandas</h2>
          <p className="text-3xl font-semibold text-gray-800">{cashReport.totalOrders}</p>
        </div>
      </div>

      {/* Exibir Resultado Parcial */}
      {isCashOpen && (
        <div className="grid grid-cols-2 gap-4 mb-8 w-full">
          <div className="p-4 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-600">Dinheiro</h2>
            <p className="text-3xl font-semibold text-gray-800">R$ {cashReport.cash.toFixed(2)}</p>
            <button className="mt-2 bg-blue-500 text-white p-2 rounded" onClick={() => addTransaction('cash', 10)}>Adicionar R$ 10</button>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-600">Cartão de Crédito</h2>
            <p className="text-3xl font-semibold text-gray-800">R$ {cashReport.creditCard.toFixed(2)}</p>
            <button className="mt-2 bg-blue-500 text-white p-2 rounded" onClick={() => addTransaction('creditCard', 10)}>Adicionar R$ 10</button>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-600">Cartão de Débito</h2>
            <p className="text-3xl font-semibold text-gray-800">R$ {cashReport.debitCard.toFixed(2)}</p>
            <button className="mt-2 bg-blue-500 text-white p-2 rounded" onClick={() => addTransaction('debitCard', 10)}>Adicionar R$ 10</button>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-600">Pix</h2>
            <p className="text-3xl font-semibold text-gray-800">R$ {cashReport.pix.toFixed(2)}</p>
            <button className="mt-2 bg-blue-500 text-white p-2 rounded" onClick={() => addTransaction('pix', 10)}>Adicionar R$ 10</button>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg text-center col-span-2">
            <h2 className="text-xl font-bold text-gray-600">Total Geral</h2>
            <p className="text-3xl font-semibold text-gray-800">R$ {getTotal().toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Exibir Relatório se o caixa estiver fechado */}
      {showReport && !isCashOpen && (
        <div className="mt-8 p-4 bg-white shadow-lg rounded-lg w-full">
          <h2 className="text-xl font-bold text-gray-600">Relatório de Fechamento</h2>
          <p className="mt-2">Data: {formatDate(openTime)}</p>
          <p>Horário de Abertura: {openTime?.toLocaleTimeString()}</p>
          <p>Horário de Fechamento: {closeTime?.toLocaleTimeString()}</p>
          <p>Total em Dinheiro: R$ {cashReport.cash.toFixed(2)}</p>
          <p>Total em Cartão de Crédito: R$ {cashReport.creditCard.toFixed(2)}</p>
          <p>Total em Cartão de Débito: R$ {cashReport.debitCard.toFixed(2)}</p>
          <p>Total em Pix: R$ {cashReport.pix.toFixed(2)}</p>
          <p>Total Geral: R$ {getTotal().toFixed(2)}</p>
        </div>
      )}

      {/* Botão de abrir/fechar caixa */}
      <button
        className={`mt-8 p-4 rounded-lg text-white ${isCashOpen ? 'bg-red-600' : 'bg-green-600'}`}
        onClick={toggleCash}
      >
        {isCashOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 0a1 1 0 00-1 1v2H8a2 2 0 00-2 2v2H4a2 2 0 00-2 2v2h20v-2a2 2 0 00-2-2h-2V5a2 2 0 00-2-2h-1V1a1 1 0 00-1-1zM4 8h12v2H4V8zm0 4h12v2H4v-2z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 0a1 1 0 00-1 1v2H8a2 2 0 00-2 2v2H4a2 2 0 00-2 2v2h20v-2a2 2 0 00-2-2h-2V5a2 2 0 00-2-2h-1V1a1 1 0 00-1-1zM4 8h12v2H4V8zm0 4h12v2H4v-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Home;
