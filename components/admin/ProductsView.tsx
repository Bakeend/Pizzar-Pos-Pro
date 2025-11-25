
import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { EditIcon, TrashIcon, GridViewIcon, ListViewIcon } from '../icons';

interface ProductsViewProps {
    menuItems: MenuItem[];
    onAddProduct: () => void;
    onEditProduct: (product: MenuItem) => void;
    onDeleteProduct: (productId: number) => void;
}

const ProductCard: React.FC<{ 
    item: MenuItem; 
    onEdit: () => void; 
    onDelete: () => void;
}> = ({ item, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
        <div className="p-4 flex-grow flex flex-col">
            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1 flex-grow">{item.description}</p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-brand-green">R${item.price.toFixed(2)}</span>
                <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full">{item.preparationTime} min</span>
            </div>
        </div>
        <div className="bg-gray-50 p-2 flex justify-end space-x-2">
            <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                <EditIcon className="h-5 w-5" />
            </button>
            <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors">
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
    </div>
);


const ProductsView: React.FC<ProductsViewProps> = ({ menuItems, onAddProduct, onEditProduct, onDeleteProduct }) => {
    const [filter, setFilter] = useState<'all' | 'pizza' | 'drink' | 'dessert'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredItems = menuItems.filter(item => filter === 'all' || item.category === filter);
    
    const FilterButton: React.FC<{ category: 'all' | 'pizza' | 'drink' | 'dessert'; label: string }> = ({ category, label }) => (
        <button
          onClick={() => setFilter(category)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              filter === category ? 'bg-brand-red text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          {label}
        </button>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">Gerenciamento de Produtos</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-200 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-brand-red shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                            aria-label="Visualização em Grade"
                        >
                            <GridViewIcon className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-brand-red shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                            aria-label="Visualização em Lista"
                        >
                            <ListViewIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <button 
                        onClick={onAddProduct}
                        className="bg-brand-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
                    >
                        Adicionar Novo Produto
                    </button>
                </div>
            </header>
            
            <div className="mb-6 flex items-center space-x-2">
                <FilterButton category="all" label="Todos" />
                <FilterButton category="pizza" label="Pizzas" />
                <FilterButton category="drink" label="Bebidas" />
                <FilterButton category="dessert" label="Sobremesas" />
            </div>

            <div>
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredItems.map(item => (
                            <ProductCard 
                                key={item.id} 
                                item={item} 
                                onEdit={() => onEditProduct(item)}
                                onDelete={() => onDeleteProduct(item.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preparo (min)</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">R${item.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.preparationTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => onEditProduct(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" aria-label={`Editar ${item.name}`}>
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => onDeleteProduct(item.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label={`Excluir ${item.name}`}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsView;
