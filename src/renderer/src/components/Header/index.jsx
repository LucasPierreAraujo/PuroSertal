import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">PuroSertao</h1>
        <ul className="flex space-x-4">
          <li>
            <a href="#home" className="text-white hover:text-yellow-300">Home</a>
          </li>
          <li>
            <a href="#products" className="text-white hover:text-yellow-300">Produtos</a>
          </li>
          <li>
            <a href="#orders" className="text-white hover:text-yellow-300">Comandas</a>
          </li>
          <li>
            <a href="#reports" className="text-white hover:text-yellow-300">Relatórios</a>
          </li>
          <li>
            <a href="#stock" className="text-white hover:text-yellow-300">Estoque</a>
          </li>
          <li>
            <a href="#clients" className="text-white hover:text-yellow-300">Clientes</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
