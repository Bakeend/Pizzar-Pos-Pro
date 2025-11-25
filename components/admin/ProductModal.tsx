
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import { XIcon } from '../icons';

interface ProductModalProps {
    product: MenuItem | null;
    onSave: (product: MenuItem) => void;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<MenuItem, 'id' | 'tags'>>({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: 'pizza',
        preparationTime: 10,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
                preparationTime: product.preparationTime,
            });
        } else {
            // Reset for new product
            setFormData({
                name: '',
                description: '',
                price: 0,
                image: '',
                category: 'pizza',
                preparationTime: 10,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number = value;
        if (type === 'number') {
            processedValue = parseFloat(value);
            if (isNaN(processedValue)) {
                processedValue = 0;
            }
        }
    
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProduct: MenuItem = {
            ...formData,
            id: product?.id || Date.now(),
        };
        onSave(finalProduct);
    };
    
    const isEditing = product !== null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon className="h-6 w-6 text-gray-600" />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-red focus:border-brand-red" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-red focus:border-brand-red"></textarea>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div>
                            <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700">Tempo de Preparo (min)</label>
                            <input type="number" name="preparationTime" id="preparationTime" value={formData.preparationTime} onChange={handleChange} required min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-red focus:border-brand-red" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-red focus:border-brand-red">
                            <option value="pizza">Pizza</option>
                            <option value="drink">Bebida</option>
                            <option value="dessert">Sobremesa</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">URL da Imagem</label>
                        <input type="text" name="image" id="image" value={formData.image} onChange={handleChange} required placeholder="https://picsum.photos/400/300" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-red focus:border-brand-red" />
                    </div>
                </form>

                <footer className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg border border-gray-300 transition-colors">
                        Cancelar
                    </button>
                     <button type="submit" formNoValidate onClick={handleSubmit} className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Salvar Produto
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProductModal;
