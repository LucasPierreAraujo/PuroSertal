import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importando os ícones

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [nextId, setNextId] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Carregar produtos do localStorage ao montar o componente
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(savedProducts);
    const maxId = savedProducts.length > 0 ? Math.max(...savedProducts.map(product => product.id)) : 0;
    setNextId(maxId + 1);
  }, []);

  // Atualizar o localStorage sempre que a lista de produtos mudar
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const validateProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return false;
    }
    if (parseFloat(newProduct.price) <= 0) {
      setErrorMessage('O preço deve ser um valor positivo.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!validateProduct()) return;

    const productToAdd = {
      id: nextId,
      name: capitalizeFirstLetter(newProduct.name),
      price: parseFloat(newProduct.price),
    };

    setProducts((prev) => [...prev, productToAdd]);
    setNewProduct({ name: '', price: '' });
    setNextId((prev) => prev + 1);
    setFeedbackMessage('Produto adicionado com sucesso!');
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, price: product.price });
    setFeedbackMessage('');
  };

  const updateProduct = (e) => {
    e.preventDefault();
    if (!validateProduct()) return;

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? { ...product, name: capitalizeFirstLetter(newProduct.name), price: parseFloat(newProduct.price) }
        : product
    );

    setProducts(updatedProducts);
    setNewProduct({ name: '', price: '' });
    setEditingProduct(null);
    setFeedbackMessage('Produto atualizado com sucesso!');
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    setFeedbackMessage('Produto excluído com sucesso!');
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Produtos</h1>
      {feedbackMessage && <div className="mb-4 text-green-600">{feedbackMessage}</div>}
      {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
      
      <form onSubmit={editingProduct ? updateProduct : addProduct} className="mb-6">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Nome do Produto"
          className="p-2 border border-gray-300 rounded mr-2"
          required
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Preço"
          className="p-2 border border-gray-300 rounded mr-2"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={!!editingProduct}>
          {editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
        </button>
        {editingProduct && (
          <button 
            type="button" 
            onClick={() => { setNewProduct({ name: '', price: '' }); setEditingProduct(null); }}
            className="p-2 bg-gray-300 text-black rounded hover:bg-gray-400 ml-2"
          >
            Limpar
          </button>
        )}
      </form>

      <table className="min-w-full bg-white shadow-md rounded mb-8">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Nome</th>
            <th className="py-2 px-4">Preço</th>
            <th className="py-2 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td className="border-t py-2 px-4">{product.id}</td>
                <td className="border-t py-2 px-4">{product.name}</td>
                <td className="border-t py-2 px-4">{formatCurrency(product.price)}</td>
                <td className="border-t py-2 px-4 flex items-center">
                  <button 
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 flex items-center"
                    onClick={() => editProduct(product)}
                  >
                    <FaEdit className="mr-1" /> {/* Ícone de Edição */}
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <FaTrash className="mr-1" /> {/* Ícone de Exclusão */}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border-t py-2 px-4 text-center">Nenhum produto cadastrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
