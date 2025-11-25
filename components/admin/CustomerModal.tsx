
import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { XIcon } from '../icons';

interface CustomerModalProps {
    customer: Customer | null;
    onSave: (customer: Customer) => void;
    onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address || '',
                notes: customer.notes || '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                notes: '',
            });
        }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCustomer: Customer = {
            ...formData,
            id: customer?.id || Date.now(),
        };
        onSave(finalCustomer);
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <header className="bg-brand-dark text-white px-8 py-6 flex justify-between items-start shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {customer ? 'Editar Cliente' : 'Novo Cliente'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1 font-medium">
                            {customer ? 'Atualize os dados abaixo' : 'Cadastre um novo cliente no sistema'}
                        </p>
                    </div>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </header>
                
                <div className="p-8 overflow-y-auto max-h-[70vh]">
                    <form id="customer-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 group-focus-within:text-brand-red transition-colors">👤</span>
                                </div>
                                <input 
                                    type="text" 
                                    name="name" 
                                    id="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all outline-none" 
                                    placeholder="Ex: João da Silva" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 group-focus-within:text-brand-red transition-colors">✉️</span>
                                    </div>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all outline-none" 
                                        placeholder="joao@email.com" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400 group-focus-within:text-brand-red transition-colors">📱</span>
                                    </div>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        id="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        required 
                                        className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all outline-none" 
                                        placeholder="(11) 99999-9999" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Endereço</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 group-focus-within:text-brand-red transition-colors">📍</span>
                                </div>
                                <input 
                                    type="text" 
                                    name="address" 
                                    id="address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all outline-none" 
                                    placeholder="Rua, Número, Bairro" 
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
                            <textarea 
                                name="notes" 
                                id="notes" 
                                value={formData.notes} 
                                onChange={handleChange} 
                                rows={3} 
                                className="block w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all outline-none resize-none" 
                                placeholder="Preferências, alergias ou notas importantes..."
                            ></textarea>
                        </div>
                    </form>
                </div>

                <footer className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        form="customer-form" 
                        className="px-8 py-3 bg-brand-red text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        {customer ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CustomerModal;
