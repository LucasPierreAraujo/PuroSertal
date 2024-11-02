import React, { useEffect, useState } from 'react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethodTotals, setPaymentMethodTotals] = useState({});

  const loadOrdersFromLocalStorage = () => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  };

  const loadReportsFromLocalStorage = () => {
    const savedReports = localStorage.getItem('reports');
    return savedReports ? JSON.parse(savedReports) : [];
  };

  const saveReport = (report) => {
    const existingReports = loadReportsFromLocalStorage();
    existingReports.push(report);
    localStorage.setItem('reports', JSON.stringify(existingReports));
  };

  useEffect(() => {
    const orders = loadOrdersFromLocalStorage();
    const existingReports = loadReportsFromLocalStorage();

    const reportData = existingReports.concat(orders
      .filter(order => order.isClosed) // Apenas ordens fechadas
      .map(order => ({
        date: new Date(order.createdAt).toLocaleDateString('pt-BR'), // Use 'createdAt' ou o campo correto para a data
        amountPaid: order.totalPaid,
        paymentMethod: order.paymentMethod,
      })));

    setReports(reportData);

    // Calcula o total pago
    const total = reportData.reduce((acc, report) => acc + report.amountPaid, 0);
    setTotalAmount(total);

    // Calcula o total pago por método
    const methodTotals = reportData.reduce((acc, report) => {
      acc[report.paymentMethod] = (acc[report.paymentMethod] || 0) + report.amountPaid;
      return acc;
    }, {});
    setPaymentMethodTotals(methodTotals);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Relatórios de Pagamentos</h1>
      <table className="w-full bg-white border border-gray-300 rounded shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Data</th>
            <th className="p-2">Valor Pago</th>
            <th className="p-2">Método de Pagamento</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{report.date}</td>
              <td className="p-2">R$ {report.amountPaid.toFixed(2)}</td>
              <td className="p-2">{report.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Total Pago: R$ {totalAmount.toFixed(2)}</h2>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Total por Método de Pagamento</h2>
        <ul>
          {Object.entries(paymentMethodTotals).map(([method, amount]) => (
            <li key={method}>
              {method}: R$ {amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;
