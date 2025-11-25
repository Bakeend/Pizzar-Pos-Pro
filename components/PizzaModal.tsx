
import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem } from '../types';
import { XIcon, CheckCircleIcon } from './icons';

interface PizzaModalProps {
    pizza: MenuItem;
    allPizzas: MenuItem[];
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
}

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, allPizzas, onClose, onAddToCart }) => {
    type Size = 'medium' | 'large';
    type Crust = 'classic' | 'thin' | 'cheese-filled';

    const [size, setSize] = useState<Size>('medium');
    const [crust, setCrust] = useState<Crust>('classic');
    const [isHalfAndHalf, setIsHalfAndHalf] = useState(false);
    const [secondFlavorId, setSecondFlavorId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    
    const secondFlavor = useMemo(() => {
        return allPizzas.find(p => p.id === secondFlavorId) || null;
    }, [secondFlavorId, allPizzas]);
    
    const price = useMemo(() => {
        let basePrice = pizza.price;
        
        if (isHalfAndHalf && secondFlavor) {
            basePrice = Math.max(pizza.price, secondFlavor.price);
        }

        let finalPrice = basePrice;
        if (size === 'large') finalPrice += 10.00;
        if (crust === 'cheese-filled') finalPrice += 8.00;
        
        return finalPrice;
    }, [pizza, size, crust, isHalfAndHalf, secondFlavor]);

    const handleAddToCartClick = () => {
        const flavors = isHalfAndHalf && secondFlavor ? [pizza, secondFlavor] : [pizza];
        
        const newCartItem: CartItem = {
            item: pizza,
            quantity: quantity,
            customization: {
                size,
                crust,
                flavors,
            }
        };
        onAddToCart(newCartItem);
    };

    const sizes = [
        { id: 'medium', label: 'Média', desc: '6 fatias (30cm)', priceMod: 0, icon: 'M' },
        { id: 'large', label: 'Grande', desc: '8 fatias (35cm)', priceMod: 10, icon: 'G' },
    ];

    const crusts = [
        { id: 'classic', label: 'Tradicional', price: 0 },
        { id: 'thin', label: 'Fina', price: 0 },
        { id: 'cheese-filled', label: 'Recheada', price: 8 },
    ];

    return (
         <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center z-[100] transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full md:w-[900px] md:h-[600px] md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Left Side: Visuals (Hidden on small screens, mostly) */}
                <div className="w-full md:w-5/12 relative bg-gray-100 flex flex-col">
                     <div className="absolute top-4 left-4 z-10">
                        <button onClick={onClose} className="md:hidden p-2 bg-black/50 rounded-full text-white">
                            <XIcon className="h-6 w-6" />
                        </button>
                     </div>
                    <div className="h-48 md:h-1/2 w-full relative overflow-hidden">
                         <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 md:to-transparent"></div>
                    </div>
                    
                    <div className="flex-grow p-6 flex flex-col justify-center bg-brand-dark text-white relative overflow-hidden">
                         {/* Decorative Circle */}
                         <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-red rounded-full opacity-20 blur-2xl"></div>

                         <h2 className="text-3xl font-bold font-serif mb-2 relative z-10">{pizza.name}</h2>
                         <p className="text-gray-300 text-sm leading-relaxed relative z-10">{pizza.description}</p>
                         <div className="mt-6 flex items-center gap-2 text-brand-yellow font-bold relative z-10">
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                                {size === 'large' ? '8 Pedaços' : '6 Pedaços'}
                            </span>
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                                {crust === 'cheese-filled' ? 'Borda Recheada' : 'Borda Simples'}
                            </span>
                         </div>
                    </div>
                </div>

                {/* Right Side: Controls */}
                <main className="flex-1 flex flex-col bg-white h-full overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 hidden md:flex">
                        <h3 className="text-lg font-bold text-gray-800">Personalize sua Pizza</h3>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        
                        {/* Size Selection */}
                        <section>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">1. Tamanho</h4>
                            <div className="flex gap-4">
                                {sizes.map((s) => (
                                    <div 
                                        key={s.id}
                                        onClick={() => {
                                            setSize(s.id as Size);
                                            if(s.id === 'medium') setIsHalfAndHalf(false);
                                        }}
                                        className={`flex-1 relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center text-center group ${
                                            size === s.id 
                                            ? 'border-brand-red bg-red-50/50' 
                                            : 'border-gray-200 bg-white hover:border-red-200'
                                        }`}
                                    >
                                        {size === s.id && <div className="absolute top-2 right-2 text-brand-red"><CheckCircleIcon className="w-5 h-5" /></div>}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mb-2 transition-colors ${size === s.id ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-red-100 group-hover:text-brand-red'}`}>
                                            {s.icon}
                                        </div>
                                        <span className={`font-bold ${size === s.id ? 'text-brand-dark' : 'text-gray-600'}`}>{s.label}</span>
                                        {s.priceMod > 0 && <span className="text-xs font-bold text-brand-red mt-1">+ R${s.priceMod},00</span>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Crust Selection */}
                        <section>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">2. Borda</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {crusts.map((c) => (
                                    <button 
                                        key={c.id}
                                        onClick={() => setCrust(c.id as Crust)}
                                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                            crust === c.id 
                                            ? 'border-brand-yellow bg-yellow-50 text-brand-dark shadow-sm' 
                                            : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                    >
                                        {c.label}
                                        {c.price > 0 && <span className="block text-[10px] font-bold text-brand-green">+R${c.price}</span>}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Half and Half */}
                        {size === 'large' && (
                            <section className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">3. Sabores</h4>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={isHalfAndHalf} onChange={(e) => setIsHalfAndHalf(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">Meio a Meio?</span>
                                    </label>
                                </div>
                                
                                {isHalfAndHalf ? (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative overflow-hidden">
                                         {/* Pizza Visual Representation */}
                                         <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
                                             <div className="w-32 h-32 rounded-full border-4 border-gray-800 flex overflow-hidden">
                                                 <div className="w-1/2 h-full bg-gray-800"></div>
                                                 <div className="w-1/2 h-full bg-gray-300"></div>
                                             </div>
                                         </div>

                                        <div className="space-y-3 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-brand-dark">1/2 {pizza.name}</span>
                                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Incluso</span>
                                            </div>
                                            <div className="w-full h-px bg-gray-200"></div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5">Escolha a 2ª metade:</label>
                                                <select 
                                                    value={secondFlavorId ?? ''} 
                                                    onChange={(e) => setSecondFlavorId(Number(e.target.value))} 
                                                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-brand-red focus:border-brand-red outline-none"
                                                >
                                                    <option value="">Selecione...</option>
                                                    {allPizzas.filter(p => p.id !== pizza.id).map(p => (
                                                        <option key={p.id} value={p.id}>{p.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-gray-500 text-sm">
                                        Pizza inteira sabor <strong>{pizza.name}</strong>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Notes */}
                        <section>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Observações</h4>
                            <textarea 
                                rows={2} 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tirar cebola, cortar em aperitivo..." 
                                className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-red text-sm resize-none placeholder-gray-400"
                            ></textarea>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
                        <div className="flex items-center justify-between gap-4">
                             {/* Quantity Control */}
                             <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                                    className="w-10 h-10 rounded-lg bg-white text-gray-700 font-bold shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center font-bold text-lg text-gray-800">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)} 
                                    className="w-10 h-10 rounded-lg bg-white text-gray-700 font-bold shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            <button 
                                onClick={handleAddToCartClick} 
                                disabled={isHalfAndHalf && !secondFlavorId}
                                className="flex-1 bg-brand-red hover:bg-red-700 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex justify-between items-center"
                            >
                                <span>Adicionar</span>
                                <span className="bg-white/20 px-2 py-1 rounded text-sm">R$ {(price * quantity).toFixed(2)}</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PizzaModal;