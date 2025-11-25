
import React, { useState, useEffect } from 'react';
import { Coupon } from '../../types';
import { XIcon, TicketIcon } from '../icons';

interface CouponModalProps {
    coupon: Coupon | null;
    onSave: (coupon: Coupon) => void;
    onClose: () => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ coupon, onSave, onClose }) => {
    const [formData, setFormData] = useState<Coupon>({
        code: '',
        type: 'percentage',
        value: 0,
        minValue: 0,
        description: '',
    });

    useEffect(() => {
        if (coupon) {
            setFormData(coupon);
        } else {
            setFormData({
                code: '',
                type: 'percentage',
                value: 0,
                minValue: 0,
                description: '',
            });
        }
    }, [coupon]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number = value;
        
        if (name === 'code') {
            processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Force uppercase alphanumeric
        } else if (type === 'number') {
            processedValue = parseFloat(value);
            if (isNaN(processedValue)) processedValue = 0;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const isEditing = !!coupon;

    return (
        <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <header className="bg-gradient-to-r from-brand-dark to-gray-800 text-white px-6 py-5 flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <TicketIcon className="h-5 w-5 text-brand-yellow" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">
                            {isEditing ? 'Editar Cupom' : 'Novo Cupom'}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Code Input */}
                    <div>
                        <label htmlFor="code" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Código do Cupom</label>
                        <input 
                            type="text" 
                            name="code" 
                            id="code" 
                            value={formData.code} 
                            onChange={handleChange} 
                            readOnly={isEditing}
                            required 
                            placeholder="EX: VERAO2024"
                            className={`block w-full px-4 py-3 border rounded-xl font-mono font-bold text-lg tracking-widest focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all ${isEditing ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'bg-gray-50 border-gray-200 focus:bg-white text-brand-dark'}`}
                        />
                        {!isEditing && <p className="text-xs text-gray-400 mt-1">Letras maiúsculas e números apenas.</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type Select */}
                        <div>
                            <label htmlFor="type" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tipo</label>
                            <select 
                                name="type" 
                                id="type" 
                                value={formData.type} 
                                onChange={handleChange} 
                                className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-brand-red focus:border-brand-red outline-none"
                            >
                                <option value="percentage">Porcentagem (%)</option>
                                <option value="fixed">Valor Fixo (R$)</option>
                            </select>
                        </div>

                        {/* Value Input */}
                        <div>
                            <label htmlFor="value" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    name="value" 
                                    id="value" 
                                    value={formData.value} 
                                    onChange={handleChange} 
                                    required 
                                    min="0" 
                                    step={formData.type === 'fixed' ? "0.01" : "1"}
                                    className="block w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red outline-none" 
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                                    {formData.type === 'percentage' ? '%' : 'R$'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Min Value */}
                    <div>
                        <label htmlFor="minValue" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor Mínimo do Pedido (Opcional)</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-bold text-sm">R$</div>
                            <input 
                                type="number" 
                                name="minValue" 
                                id="minValue" 
                                value={formData.minValue || ''} 
                                onChange={handleChange} 
                                min="0" 
                                step="0.01" 
                                placeholder="0.00"
                                className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red outline-none" 
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Descrição</label>
                        <textarea 
                            name="description" 
                            id="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            rows={2} 
                            placeholder="Ex: 10% off em pedidos acima de R$50"
                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red outline-none resize-none text-sm"
                        ></textarea>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 px-4 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-4 py-3 bg-brand-red text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CouponModal;
