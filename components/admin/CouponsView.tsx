
import React from 'react';
import { Coupon } from '../../types';
import { EditIcon, TrashIcon, TicketIcon } from '../icons';

interface CouponsViewProps {
    coupons: Coupon[];
    onAddCoupon: () => void;
    onEditCoupon: (coupon: Coupon) => void;
    onDeleteCoupon: (code: string) => void;
}

const CouponCard: React.FC<{ coupon: Coupon; onEdit: () => void; onDelete: () => void }> = ({ coupon, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
        <div className="p-5 border-b border-dashed border-gray-200 relative overflow-hidden">
            {/* Background Pattern for "Ticket" look */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full"></div>
            
            <div className="flex justify-between items-start">
                <div>
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
                        coupon.type === 'percentage' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {coupon.type === 'percentage' ? 'Porcentagem' : 'Valor Fixo'}
                    </span>
                    <h3 className="text-xl font-black text-gray-800 tracking-wide">{coupon.code}</h3>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-bold text-brand-red">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `R$ ${coupon.value.toFixed(2)}`}
                    </span>
                    <span className="text-xs text-gray-400 uppercase font-bold">OFF</span>
                </div>
            </div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col justify-between bg-gray-50/50">
            <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">{coupon.description}</p>
                {coupon.minValue && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="font-semibold">Pedido Mínimo:</span> R$ {coupon.minValue.toFixed(2)}
                    </p>
                )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button 
                    onClick={onEdit}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <EditIcon className="w-4 h-4" /> Editar
                </button>
                <button 
                    onClick={onDelete}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                    <TrashIcon className="w-4 h-4" /> Excluir
                </button>
            </div>
        </div>
    </div>
);

const CouponsView: React.FC<CouponsViewProps> = ({ coupons, onAddCoupon, onEditCoupon, onDeleteCoupon }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Cupons de Desconto</h2>
                        <p className="text-gray-500 mt-1">Crie e gerencie promoções para seus clientes.</p>
                    </div>
                    <button 
                        onClick={onAddCoupon}
                        className="bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <TicketIcon className="h-5 w-5" />
                        <span>Criar Cupom</span>
                    </button>
                </header>

                {coupons.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
                            <TicketIcon className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Nenhum cupom ativo</h3>
                        <p className="text-gray-500 mt-1 mb-6">Comece criando uma nova promoção para impulsionar as vendas.</p>
                        <button onClick={onAddCoupon} className="text-brand-red font-bold hover:underline">
                            + Criar primeiro cupom
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map((coupon) => (
                            <CouponCard 
                                key={coupon.code} 
                                coupon={coupon} 
                                onEdit={() => onEditCoupon(coupon)}
                                onDelete={() => onDeleteCoupon(coupon.code)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponsView;
