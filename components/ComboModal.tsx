
import React, { useState } from 'react';
import { MenuItem } from '../types';
import { XIcon, CheckCircleIcon } from './icons';

interface ComboModalProps {
    pizzas: MenuItem[];
    drinks: MenuItem[];
    onClose: () => void;
    onAddCombo: (pizza1: MenuItem, pizza2: MenuItem, drink: MenuItem) => void;
}

const ComboModal: React.FC<ComboModalProps> = ({ pizzas, drinks, onClose, onAddCombo }) => {
    const [pizza1Id, setPizza1Id] = useState<number | ''>('');
    const [pizza2Id, setPizza2Id] = useState<number | ''>('');
    const [drinkId, setDrinkId] = useState<number | ''>('');

    const handleSubmit = () => {
        if (!pizza1Id || !pizza2Id || !drinkId) return;
        const pizza1 = pizzas.find(p => p.id === Number(pizza1Id));
        const pizza2 = pizzas.find(p => p.id === Number(pizza2Id));
        const drink = drinks.find(d => d.id === Number(drinkId));
        
        if (pizza1 && pizza2 && drink) {
            onAddCombo(pizza1, pizza2, drink);
        }
    };

    const isReady = pizza1Id !== '' && pizza2Id !== '' && drinkId !== '';

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-brand-red to-orange-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <span className="bg-brand-yellow text-brand-dark text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Oferta Especial</span>
                            <h2 className="text-3xl font-bold font-serif leading-tight">Combo Família Suprema</h2>
                            <p className="text-white/90 mt-2 text-sm max-w-md">2 Pizzas Grandes (Tradicionais) + 1 Bebida por um preço imperdível.</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pizza 1 */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Primeira Pizza (Grande)
                            </label>
                            <select 
                                value={pizza1Id} 
                                onChange={(e) => setPizza1Id(Number(e.target.value))}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none cursor-pointer hover:bg-white transition-colors"
                            >
                                <option value="" disabled>Escolha o sabor...</option>
                                {pizzas.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pizza 2 */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Segunda Pizza (Grande)
                            </label>
                            <select 
                                value={pizza2Id} 
                                onChange={(e) => setPizza2Id(Number(e.target.value))}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none cursor-pointer hover:bg-white transition-colors"
                            >
                                <option value="" disabled>Escolha o sabor...</option>
                                {pizzas.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Drink */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                            Bebida (2L ou similar)
                        </label>
                        <select 
                            value={drinkId} 
                            onChange={(e) => setDrinkId(Number(e.target.value))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none cursor-pointer hover:bg-white transition-colors"
                        >
                            <option value="" disabled>Escolha a bebida...</option>
                            {drinks.map(d => (
                                <option key={d.id} value={d.id}>{d.name} - R${d.price.toFixed(2)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <footer className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total do Combo</p>
                        <p className="text-3xl font-black text-brand-green">R$ 89,90</p>
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        disabled={!isReady}
                        className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 transition-all transform ${
                            isReady 
                            ? 'bg-brand-red text-white hover:bg-red-700 hover:-translate-y-1 shadow-red-500/30' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {isReady && <CheckCircleIcon className="w-6 h-6" />}
                        Adicionar ao Carrinho
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ComboModal;
